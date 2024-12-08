#!/bin/bash
set -e

# test database MUST match sequeelize/config.js test configuration
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE correctomatic_test;

  CREATE USER correctomatic_test WITH PASSWORD 'correctomatic_test';
  GRANT ALL PRIVILEGES ON DATABASE correctomatic_test TO correctomatic_test;
EOSQL
