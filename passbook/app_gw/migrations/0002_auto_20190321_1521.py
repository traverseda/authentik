# Generated by Django 2.1.7 on 2019-03-21 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('passbook_app_gw', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rewriterule',
            name='conditions',
            field=models.ManyToManyField(blank=True, to='passbook_core.Policy'),
        ),
    ]
