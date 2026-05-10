import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings
from rest_framework_simplejwt.tokens import RefreshToken

from apps.notes.models import Note
from .models import Comment

User = get_user_model()


@override_settings(COMMENT_CREATE_RATE_LIMIT=2, COMMENT_CREATE_RATE_WINDOW_SECONDS=900)
class CommentRateLimitTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="comment-owner",
            email="comment-owner@example.com",
            password="correct-password",
        )
        self.note = Note.objects.create(
            user=self.user,
            title="Public note",
            content="content",
            is_public=True,
        )
        token = RefreshToken.for_user(self.user).access_token
        self.auth_header = f"Bearer {token}"

    def post_comment(self, content: str):
        return self.client.post(
            f"/api/community/notes/{self.note.id}/comments",
            data=json.dumps({"content": content}),
            content_type="application/json",
            HTTP_AUTHORIZATION=self.auth_header,
        )

    def test_comment_creation_is_rate_limited(self):
        first_response = self.post_comment("first")
        second_response = self.post_comment("second")
        third_response = self.post_comment("third")

        self.assertEqual(first_response.status_code, 201)
        self.assertEqual(second_response.status_code, 201)
        self.assertEqual(third_response.status_code, 429)
        self.assertEqual(Comment.objects.filter(user=self.user).count(), 2)
