# Generated by Django 4.2.7 on 2024-01-14 19:33

import datetime

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Product",
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
                ("name", models.CharField(max_length=60, verbose_name="name")),
                (
                    "price",
                    models.FloatField(blank=True, null=True, verbose_name="price"),
                ),
                (
                    "shipping_price",
                    models.FloatField(default="0", verbose_name="shipping price"),
                ),
                ("description", models.TextField(blank=True, default="")),
                (
                    "post_date",
                    models.DateTimeField(
                        default=datetime.datetime.now, verbose_name="post date"
                    ),
                ),
                (
                    "image",
                    models.ImageField(blank=True, null=True, upload_to="products"),
                ),
            ],
            options={
                "verbose_name": "Product",
            },
        ),
        migrations.CreateModel(
            name="Review",
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
                    "review_type",
                    models.CharField(default="overall", max_length=20),
                ),
                (
                    "overall_rating",
                    models.PositiveIntegerField(
                        blank=True,
                        choices=[
                            (1, "1"),
                            (2, "2"),
                            (3, "3"),
                            (4, "4"),
                            (5, "5"),
                        ],
                        null=True,
                    ),
                ),
                (
                    "quality_rating",
                    models.PositiveIntegerField(
                        blank=True,
                        choices=[
                            (1, "1"),
                            (2, "2"),
                            (3, "3"),
                            (4, "4"),
                            (5, "5"),
                        ],
                        null=True,
                    ),
                ),
                (
                    "delivery_rating",
                    models.PositiveIntegerField(
                        blank=True,
                        choices=[
                            (1, "1"),
                            (2, "2"),
                            (3, "3"),
                            (4, "4"),
                            (5, "5"),
                        ],
                        null=True,
                    ),
                ),
                (
                    "communication_rating",
                    models.PositiveIntegerField(
                        blank=True,
                        choices=[
                            (1, "1"),
                            (2, "2"),
                            (3, "3"),
                            (4, "4"),
                            (5, "5"),
                        ],
                        null=True,
                    ),
                ),
                ("description", models.TextField(blank=True)),
                (
                    "post_date",
                    models.DateTimeField(
                        default=datetime.datetime.now, verbose_name="post date"
                    ),
                ),
            ],
        ),
    ]
