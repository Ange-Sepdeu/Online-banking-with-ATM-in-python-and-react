import os
from django.core.management.base import BaseCommand
import subprocess
from django.conf import settings
import os


class Command(BaseCommand):

    help = "You need to have pg_dump added to your environment variable"

    def handle(self, *args, **kwargs):
        database = settings.DATABASES["default"]["NAME"]
        user = settings.DATABASES["default"]["USER"]
        password = settings.DATABASES["default"]["PASSWORD"]
        port = settings.DATABASES["default"]["PORT"]
        host = settings.DATABASES["default"]["HOST"]
        filename = f"{database}_backup.sql"
        suffix = f"--dbname=postgresql://{user}:{password}@{host}:{port}/{database} > {filename}"
        commandstr = "pg_dump " + suffix

        try:
            os.system(commandstr)
            print(f"Backup successsful, filename : {filename}")
        except Exception as e:
            print(
                f"An error occured: {e}, you need to set up the environment variable for postgres"
            )
