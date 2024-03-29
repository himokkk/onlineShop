# Generated by Django 4.2.7 on 2024-01-28 11:32

import categories.models
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(max_length=100, unique=True, verbose_name="name"),
                ),
                (
                    "svg",
                    models.FileField(
                        blank=True,
                        null=True,
                        upload_to="category",
                        validators=[categories.models.validate_svg],
                    ),
                ),
            ],
            options={
                "verbose_name": "Category",
                "verbose_name_plural": "Categories",
            },
        ),
    ]
