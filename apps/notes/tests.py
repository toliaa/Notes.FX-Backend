import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Note, Tag

User = get_user_model()


@override_settings(NOTE_CREATE_RATE_LIMIT=100)
class NoteTagLimitTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="tag-owner",
            email="tag-owner@example.com",
            password="correct-password",
        )
        token = RefreshToken.for_user(self.user).access_token
        self.auth_header = f"Bearer {token}"

    def post_json(self, path: str, payload: dict):
        return self.client.post(
            path,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_AUTHORIZATION=self.auth_header,
        )

    def create_tags(self, count: int):
        tags = []
        for index in range(count):
            response = self.post_json("/api/notes/tags", {"name": f"tag-{index}"})
            self.assertEqual(response.status_code, 201)
            tags.append(Tag.objects.get(id=response.json()["id"]))
        return tags

    def test_user_can_create_more_than_five_tags(self):
        self.create_tags(6)

        self.assertEqual(Tag.objects.filter(user=self.user).count(), 6)

    def test_tag_limit_is_applied_per_note(self):
        tags = self.create_tags(6)
        tag_ids = [str(tag.id) for tag in tags]

        first_response = self.post_json(
            "/api/notes/notes",
            {
                "title": "First tagged note",
                "content": "content",
                "tag_ids": tag_ids[:5],
            },
        )
        second_response = self.post_json(
            "/api/notes/notes",
            {
                "title": "Second tagged note",
                "content": "content",
                "tag_ids": tag_ids[1:6],
            },
        )
        too_many_response = self.post_json(
            "/api/notes/notes",
            {
                "title": "Too many tags",
                "content": "content",
                "tag_ids": tag_ids,
            },
        )

        self.assertEqual(first_response.status_code, 201)
        self.assertEqual(second_response.status_code, 201)
        self.assertEqual(too_many_response.status_code, 400)
        self.assertEqual(too_many_response.json()["detail"], "Maximum 5 tags per note")
        self.assertEqual(Note.objects.filter(user=self.user).count(), 2)


@override_settings(
    MAX_NOTES_PER_USER=2,
    NOTE_CREATE_RATE_LIMIT=100,
)
class NoteSpamLimitTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="note-limit-owner",
            email="note-limit-owner@example.com",
            password="correct-password",
        )
        token = RefreshToken.for_user(self.user).access_token
        self.auth_header = f"Bearer {token}"

    def post_note(self, title: str):
        return self.client.post(
            "/api/notes/notes",
            data=json.dumps({"title": title, "content": "content"}),
            content_type="application/json",
            HTTP_AUTHORIZATION=self.auth_header,
        )

    def test_user_cannot_create_more_than_max_notes(self):
        first_response = self.post_note("First")
        second_response = self.post_note("Second")
        third_response = self.post_note("Third")

        self.assertEqual(first_response.status_code, 201)
        self.assertEqual(second_response.status_code, 201)
        self.assertEqual(third_response.status_code, 400)
        self.assertEqual(third_response.json()["detail"], "Maximum 2 notes per user")
        self.assertEqual(Note.objects.filter(user=self.user).count(), 2)
