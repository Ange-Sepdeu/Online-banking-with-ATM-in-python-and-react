import os

database='ecash_app'
user='postgres'
password='Centre125fq'
port='5432'
host='localhost'
filename="backup.sql"
suffix = f"--dbname=postgresql://{user}:{password}@{host}:{port}/{database} > {filename}"
commandstr = "pg_dump "+suffix
#commandstr = f'PGPASSWORD={password} pg_dump -U {user} -h {host} {database} > {filename}'
try:
    os.system(commandstr)
except Exception as e:
    print(f"An error occured: {e}")