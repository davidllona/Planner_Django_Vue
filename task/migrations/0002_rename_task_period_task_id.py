# Generated by Django 4.1.7 on 2023-03-28 18:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='period',
            old_name='task',
            new_name='task_id',
        ),
    ]
