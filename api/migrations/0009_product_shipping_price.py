# Generated by Django 4.1.1 on 2023-03-14 18:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_alter_product_description"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="shipping_price",
            field=models.FloatField(default="0", verbose_name="shipping price"),
        ),
    ]
