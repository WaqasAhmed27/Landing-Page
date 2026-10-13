CREATE TABLE IF NOT EXISTS waitlist_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  business_name TEXT,
  city TEXT,
  pos_software TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  submitted_at TEXT NOT NULL,
  email_status TEXT NOT NULL DEFAULT 'pending',
  email_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_waitlist_submissions_submitted_at
  ON waitlist_submissions (submitted_at);

CREATE INDEX IF NOT EXISTS idx_waitlist_submissions_email
  ON waitlist_submissions (email);
