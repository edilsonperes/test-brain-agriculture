#!/bin/bash

file="/docker-entrypoint-initdb.d/dump.pgdata"

pg_restore -U $POSTGRES_USER --dbname=$POSTGRES_DB -O --single-transaction < "$file" || exit 1