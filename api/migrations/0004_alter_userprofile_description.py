# Generated by Django 4.1.1 on 2022-10-08 23:53

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_alter_userprofile_birth"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="description",
            field=models.TextField(default=""),
        ),
    ]
