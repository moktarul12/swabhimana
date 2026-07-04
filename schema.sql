-- ShareHope Database Schema (Item Donation Platform)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS item_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS item_donations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  condition TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  image_key TEXT,
  pickup_address TEXT NOT NULL,
  pickup_date TEXT,
  pickup_time TEXT,
  contact_number TEXT,
  volunteer_name TEXT,
  volunteer_phone TEXT,
  delivery_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES item_categories(id)
);

CREATE TABLE IF NOT EXISTS donation_photos (
  id TEXT PRIMARY KEY,
  donation_id TEXT NOT NULL,
  photo_type TEXT NOT NULL,
  image_key TEXT NOT NULL,
  FOREIGN KEY (donation_id) REFERENCES item_donations(id)
);

CREATE TABLE IF NOT EXISTS donation_tracking (
  id TEXT PRIMARY KEY,
  donation_id TEXT NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT,
  step_date TEXT,
  step_time TEXT,
  is_completed INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (donation_id) REFERENCES item_donations(id)
);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_key TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS impact_stats (
  id TEXT PRIMARY KEY,
  total_volunteers TEXT NOT NULL,
  families_helped TEXT NOT NULL,
  items_donated TEXT NOT NULL,
  lives_impacted TEXT NOT NULL,
  communities_reached TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notification_settings (
  user_id TEXT PRIMARY KEY,
  donation_updates INTEGER DEFAULT 1,
  pickup_alerts INTEGER DEFAULT 1,
  impact_stories INTEGER DEFAULT 1,
  promotional INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
