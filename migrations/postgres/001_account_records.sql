CREATE TABLE IF NOT EXISTS marine_account_records (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  revision text NOT NULL
);
