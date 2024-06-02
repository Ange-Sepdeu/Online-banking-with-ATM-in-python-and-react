from django.core.management.base import BaseCommand
import subprocess
from django.conf import settings
import os


class Command(BaseCommand):
    help = "Restore the database from a backup file and provide the database name"

    def add_arguments(self, parser):
        parser.add_argument(
            "backup_file",
            type=str,
            help="First argument: The backup file to restore from",
        )
        parser.add_argument(
            "db", type=str, help="Second argument: The database name to restore to"
        )

    def handle(self, *args, **kwargs):
        backup_file = kwargs["backup_file"]
        db_name = kwargs["db"]
        db_user = settings.DATABASES["default"]["USER"]
        db_password = settings.DATABASES["default"]["PASSWORD"]
        db_host = settings.DATABASES["default"]["HOST"]
        db_port = settings.DATABASES["default"]["PORT"]
        try:
            suffix = f"-U {db_user} -d {db_name} < {backup_file}"
            commandstr = "psql " + suffix
            os.system(commandstr)
            print("Database restored successfully !")
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Error during restore: {e}"))
