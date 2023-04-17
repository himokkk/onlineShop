# Generated by Django 4.1.1 on 2023-03-28 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0010_review"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
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
                    "status",
                    models.CharField(
                        choices=[
                            ("waiting for payment", "waiting for payment"),
                            ("paid", "paid"),
                            ("sent", "sent"),
                            ("delivered", "delivered"),
                        ],
                        default="waiting for payment",
                        max_length=30,
                    ),
                ),
                (
                    "package_number",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                ("items", models.ManyToManyField(null=True, to="api.product")),
            ],
            options={
                "verbose_name": "Order",
            },
        ),
    ]