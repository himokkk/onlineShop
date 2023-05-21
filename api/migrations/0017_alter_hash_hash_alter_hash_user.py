# Generated by Django 4.1.1 on 2023-05-20 13:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0016_hash"),
    ]

    operations = [
        migrations.AlterField(
            model_name="hash",
            name="hash",
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name="hash",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
                unique=True,
            ),
        ),
    ]
