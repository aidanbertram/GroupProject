#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://testuser:eUCaFfIvqKk7isxEFWKEw46RgNAarcku@dpg-cqggqstds78s73cf39m0-a.oregon-postgres.render.com/db_name_07so"

# Execute each .sql file in the directory
for file in ./src/init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done