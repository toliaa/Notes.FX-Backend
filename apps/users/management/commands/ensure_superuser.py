import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update a superuser from environment variables."

    def handle(self, *args, **options):
        email = (os.getenv("DJANGO_SUPERUSER_EMAIL") or "").strip()
        username = (os.getenv("DJANGO_SUPERUSER_USERNAME") or "").strip()
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD") or ""

        if not email:
            self.stdout.write(
                self.style.WARNING(
                    "Skipped superuser setup: DJANGO_SUPERUSER_EMAIL is not set."
                )
            )
            return

        if not username:
            raise CommandError("DJANGO_SUPERUSER_USERNAME is required.")

        if not password:
            raise CommandError("DJANGO_SUPERUSER_PASSWORD is required.")

        User = get_user_model()
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        updated_fields = []

        if user.username != username:
            user.username = username
            updated_fields.append("username")

        if not user.is_staff:
            user.is_staff = True
            updated_fields.append("is_staff")

        if not user.is_superuser:
            user.is_superuser = True
            updated_fields.append("is_superuser")

        if not user.is_active:
            user.is_active = True
            updated_fields.append("is_active")

        if created or not user.check_password(password):
            user.set_password(password)
            updated_fields.append("password")

        if created:
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f"Created superuser for {email}.")
            )
            return

        if updated_fields:
            user.save(update_fields=list(dict.fromkeys(updated_fields)))
            self.stdout.write(
                self.style.SUCCESS(
                    f"Updated superuser for {email}: {', '.join(dict.fromkeys(updated_fields))}."
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(f"Superuser for {email} already exists.")
        )
