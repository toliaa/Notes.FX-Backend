import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings

User = get_user_model()


@override_settings(AUTH_RATE_LIMIT=2, AUTH_RATE_WINDOW_SECONDS=900)
class LoginRateLimitTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="login-owner",
            email="login-owner@example.com",
            password="correct-password",
        )

    def post_login(self, password: str):
        return self.client.post(
            "/api/auth/login",
            data=json.dumps({"email": self.user.email, "password": password}),
            content_type="application/json",
        )

    def test_failed_login_attempts_are_rate_limited(self):
        first_response = self.post_login("wrong-password")
        second_response = self.post_login("wrong-password")
        third_response = self.post_login("wrong-password")

        self.assertEqual(first_response.status_code, 401)
        self.assertEqual(second_response.status_code, 401)
        self.assertEqual(third_response.status_code, 429)
