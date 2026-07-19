import { createClient } from '@libsql/client/web';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TURSO_URL = process.env.EXPO_PUBLIC_TURSO_DATABASE_URL || '';
const TURSO_TOKEN = process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN || '';

let client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!client) {
    client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
  }
  return client;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateDonationId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `DON-2026-${String(num).slice(0, 6)}`;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  created_at: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  address: string;
  contact_number: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: number;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  is_active: number;
}

export interface AdminDonation extends ItemDonation {
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
}

export type DonationStatus = 'pending' | 'collected' | 'distributed' | 'completed';

export interface ItemDonation {
  id: string;
  user_id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  quantity: number;
  condition: string;
  description: string | null;
  status: DonationStatus;
  image_key: string | null;
  pickup_address: string;
  pickup_date: string | null;
  pickup_time: string | null;
  contact_number: string | null;
  volunteer_id: string | null;
  volunteer_name: string | null;
  volunteer_phone: string | null;
  delivery_date: string | null;
  created_at: string;
}

export interface DonationTrackingStep {
  id: string;
  donation_id: string;
  step_title: string;
  step_description: string | null;
  step_date: string | null;
  step_time: string | null;
  is_completed: number;
  sort_order: number;
}

export interface DonationPhoto {
  id: string;
  donation_id: string;
  photo_type: 'upload' | 'collected' | 'delivery';
  image_key: string;
}

export interface Story {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image_key: string;
  created_at: string;
}

export interface ImpactStats {
  total_volunteers: string;
  families_helped: string;
  items_donated: string;
  lives_impacted: string;
  communities_reached: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  read: number;
  created_at: string;
}

export interface NotificationSettings {
  user_id: string;
  donation_updates: number;
  pickup_alerts: number;
  impact_stories: number;
  promotional: number;
}

const SCHEMA_VERSION = 7;

const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, avatar TEXT, bio TEXT, phone TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS volunteers (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL,
  email TEXT UNIQUE, password TEXT,
  is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS item_categories (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, icon TEXT NOT NULL,
  color TEXT NOT NULL, sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS user_addresses (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, label TEXT NOT NULL,
  address TEXT NOT NULL, contact_number TEXT,
  latitude REAL, longitude REAL, is_default INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS item_donations (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, category_id TEXT NOT NULL,
  quantity INTEGER NOT NULL, condition TEXT NOT NULL, description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', image_key TEXT,
  pickup_address TEXT NOT NULL, pickup_date TEXT, pickup_time TEXT,
  contact_number TEXT, volunteer_id TEXT, volunteer_name TEXT, volunteer_phone TEXT,
  delivery_date TEXT, created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS donation_photos (
  id TEXT PRIMARY KEY, donation_id TEXT NOT NULL, photo_type TEXT NOT NULL,
  image_key TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS donation_tracking (
  id TEXT PRIMARY KEY, donation_id TEXT NOT NULL, step_title TEXT NOT NULL,
  step_description TEXT, step_date TEXT, step_time TEXT,
  is_completed INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY, category TEXT NOT NULL, title TEXT NOT NULL,
  excerpt TEXT NOT NULL, content TEXT NOT NULL, image_key TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS impact_stats (
  id TEXT PRIMARY KEY, total_volunteers TEXT NOT NULL, families_helped TEXT NOT NULL,
  items_donated TEXT NOT NULL, lives_impacted TEXT NOT NULL,
  communities_reached TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL,
  title TEXT NOT NULL, body TEXT, read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id TEXT PRIMARY KEY, donation_updates INTEGER DEFAULT 1,
  pickup_alerts INTEGER DEFAULT 1, impact_stories INTEGER DEFAULT 1,
  promotional INTEGER DEFAULT 0
);
`;

// Ordered children-before-parents so drops are safe even if FK enforcement
// stays on. Includes legacy tables from earlier app versions
// (campaigns/donations/categories) that still reference users.
const DROP_ORDER = [
  'donations', 'campaigns',
  'notification_settings', 'notifications', 'stories', 'impact_stats',
  'donation_tracking', 'donation_photos', 'item_donations', 'user_addresses',
  'volunteers', 'item_categories', 'categories', 'users',
  'app_meta',
];

const DROP_DDL = 'PRAGMA foreign_keys=OFF;\n' +
  DROP_ORDER.map(t => `DROP TABLE IF EXISTS ${t};`).join('\n');

type Stmt = { sql: string; args: (string | number | null)[] };

function buildSeedStatements(): Stmt[] {
  const stmts: Stmt[] = [];

  stmts.push({
    sql: `INSERT INTO users (id, name, email, password, avatar, phone, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ['user-sulaiman', 'Sulaiman Shariff', 'sulaiman@manavsathis.com', 'password123', 'avatar-sulaiman', '+91 8197479540', 0],
  });

  stmts.push({
    sql: `INSERT INTO users (id, name, email, password, avatar, phone, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ['user-admin', 'ManavSathi Admin', 'admin@manavsathis.com', 'admin123', 'avatar-sulaiman', '+91 8197479540', 1],
  });

  const volunteerData: [string, string, string, string, string][] = [
    ['vol-1', 'Rohit Sharma', '9876543210', 'rohit@manavsathis.com', 'volunteer123'],
    ['vol-2', 'Priya Nair', '9876500011', 'priya@manavsathis.com', 'volunteer123'],
    ['vol-3', 'Amit Verma', '9876500022', 'amit@manavsathis.com', 'volunteer123'],
    ['vol-4', 'Sneha Reddy', '9876500033', 'sneha@manavsathis.com', 'volunteer123'],
    ['vol-5', 'Karan Patel', '9876500044', 'karan@manavsathis.com', 'volunteer123'],
    ['vol-6', 'Meera Joshi', '9876500055', 'meera@manavsathis.com', 'volunteer123'],
  ];
  for (const [id, name, phone, email, password] of volunteerData) {
    stmts.push({
      sql: `INSERT INTO volunteers (id, name, phone, email, password, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      args: [id, name, phone, email, password],
    });
  }

  const categories: [string, string, string, string, number][] = [
    ['cat-clothes', 'Clothes', 'shirt-outline', '#1B5E20', 1],
    ['cat-food', 'Food', 'fast-food-outline', '#E65100', 2],
    ['cat-books', 'Books', 'book-outline', '#7B1FA2', 3],
    ['cat-toys', 'Toys', 'game-controller-outline', '#C2185B', 4],
    ['cat-furniture', 'Furniture', 'bed-outline', '#5D4037', 5],
    ['cat-electronics', 'Electronics', 'laptop-outline', '#1565C0', 6],
    ['cat-blankets', 'Blankets', 'layers-outline', '#00897B', 7],
    ['cat-others', 'Others', 'ellipsis-horizontal-outline', '#757575', 8],
  ];
  for (const [id, name, icon, color, order] of categories) {
    stmts.push({
      sql: `INSERT INTO item_categories (id, name, icon, color, sort_order) VALUES (?, ?, ?, ?, ?)`,
      args: [id, name, icon, color, order],
    });
  }

  stmts.push({
    sql: `INSERT INTO impact_stats (id, total_volunteers, families_helped, items_donated, lives_impacted, communities_reached)
          VALUES ('global', '850+', '8,320+', '18,750+', '6,980+', '120+')`,
    args: [],
  });

  const HOME_ADDRESS = 'Koramangala 8th Block, Rajendra Nagar, Bengaluru - 560096';

  stmts.push({
    sql: `INSERT INTO user_addresses (id, user_id, label, address, contact_number, latitude, longitude, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    args: ['addr-1', 'user-sulaiman', 'Home', HOME_ADDRESS, '+91 8197479540', 12.9352, 77.6245],
  });
  stmts.push({
    sql: `INSERT INTO user_addresses (id, user_id, label, address, contact_number, latitude, longitude, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    args: ['addr-2', 'user-sulaiman', 'Office', 'Koramangala 8th Block, Rajendra Nagar, Bengaluru - 560096', '+91 8197479540', 12.9352, 77.6245],
  });

  // [id, categoryId, qty, condition, description, status, imageKey, pickupDate, pickupTime, volId, volunteerName, volunteerPhone, deliveryDate, createdAt]
  const donations: Array<[string, string, number, string, string, DonationStatus, string, string, string, string | null, string | null, string | null, string | null, string]> = [
    ['DON-2026-000123', 'cat-clothes', 15, 'Good', "Men's and Women's clothes in good condition.", 'completed', 'donation-clothes', '04 Jul 2026', '10:00 AM - 12:00 PM', 'vol-1', 'Rohit Sharma', '9876543210', '05 Jul 2026', '2026-07-04T11:30:00'],
    ['DON-2026-000122', 'cat-food', 5, 'New', 'Packaged food items and grains for families in need.', 'collected', 'donation-food', '28 Jun 2026', '02:00 PM - 04:00 PM', 'vol-2', 'Priya Nair', '9876500011', null, '2026-06-28T15:00:00'],
    ['DON-2026-000121', 'cat-books', 20, 'Good', 'Textbooks and storybooks for school children.', 'distributed', 'donation-books', '20 Jun 2026', '10:00 AM - 12:00 PM', 'vol-3', 'Amit Verma', '9876500022', '22 Jun 2026', '2026-06-20T10:30:00'],
    ['DON-2026-000120', 'cat-toys', 8, 'Good', 'Soft toys and board games for children.', 'completed', 'donation-toys', '12 Jun 2026', '10:00 AM - 12:00 PM', 'vol-4', 'Sneha Reddy', '9876500033', '14 Jun 2026', '2026-06-12T11:00:00'],
  ];
  for (const d of donations) {
    const [id, catId, qty, cond, desc, status, img, pDate, pTime, volId, volName, volPhone, delDate, createdAt] = d;
    stmts.push({
      sql: `INSERT INTO item_donations (id, user_id, category_id, quantity, condition, description, status, image_key, pickup_address, pickup_date, pickup_time, contact_number, volunteer_id, volunteer_name, volunteer_phone, delivery_date, created_at)
            VALUES (?, 'user-sulaiman', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, catId, qty, cond, desc, status, img, HOME_ADDRESS, pDate, pTime, '+91 8197479540', volId, volName, volPhone, delDate, createdAt],
    });
  }

  const trackingSteps: [string, string, string, string | null, string | null, number, number][] = [
    // DON-2026-000123 — Completed (full journey, matches Track Your Donation screen)
    ['DON-2026-000123', 'Submitted', 'Your donation request has been submitted.', '03 Jul 2026', '10:30 AM', 1, 0],
    ['DON-2026-000123', 'Accepted by ManavSathi', 'ManavSathi team has accepted your donation.', '03 Jul 2026', '02:15 PM', 1, 1],
    ['DON-2026-000123', 'Pickup Scheduled', 'A volunteer has been assigned for pickup.', '03 Jul 2026', '04:30 PM', 1, 2],
    ['DON-2026-000123', 'Collected', 'Your donation has been collected.', '04 Jul 2026', '11:30 AM', 1, 3],
    ['DON-2026-000123', 'Distributed', 'Your donation has been distributed to a family in need.', '05 Jul 2026', '04:00 PM', 1, 4],
    ['DON-2026-000123', 'Completed', 'Thank you for your generosity!', '05 Jul 2026', '04:30 PM', 1, 5],
    // DON-2026-000122 — Collected (in progress)
    ['DON-2026-000122', 'Submitted', 'Your donation request has been submitted.', '28 Jun 2026', '09:00 AM', 1, 0],
    ['DON-2026-000122', 'Accepted by ManavSathi', 'ManavSathi team has accepted your donation.', '28 Jun 2026', '11:00 AM', 1, 1],
    ['DON-2026-000122', 'Pickup Scheduled', 'A volunteer has been assigned for pickup.', '28 Jun 2026', '01:00 PM', 1, 2],
    ['DON-2026-000122', 'Collected', 'Your donation has been collected.', '28 Jun 2026', '03:00 PM', 1, 3],
    ['DON-2026-000122', 'Distributed', 'Awaiting distribution to beneficiaries.', null, null, 0, 4],
    ['DON-2026-000122', 'Completed', 'Donation journey will be completed soon.', null, null, 0, 5],
    // DON-2026-000121 — Distributed
    ['DON-2026-000121', 'Submitted', 'Your donation request has been submitted.', '20 Jun 2026', '10:00 AM', 1, 0],
    ['DON-2026-000121', 'Accepted by ManavSathi', 'ManavSathi team has accepted your donation.', '20 Jun 2026', '12:30 PM', 1, 1],
    ['DON-2026-000121', 'Pickup Scheduled', 'A volunteer has been assigned for pickup.', '20 Jun 2026', '03:00 PM', 1, 2],
    ['DON-2026-000121', 'Collected', 'Your donation has been collected.', '21 Jun 2026', '10:30 AM', 1, 3],
    ['DON-2026-000121', 'Distributed', 'Your donation has been distributed to a family in need.', '22 Jun 2026', '02:00 PM', 1, 4],
    ['DON-2026-000121', 'Completed', 'Donation journey will be completed soon.', null, null, 0, 5],
    // DON-2026-000120 — Completed
    ['DON-2026-000120', 'Submitted', 'Your donation request has been submitted.', '12 Jun 2026', '10:00 AM', 1, 0],
    ['DON-2026-000120', 'Accepted by ManavSathi', 'ManavSathi team has accepted your donation.', '12 Jun 2026', '01:00 PM', 1, 1],
    ['DON-2026-000120', 'Pickup Scheduled', 'A volunteer has been assigned for pickup.', '12 Jun 2026', '03:30 PM', 1, 2],
    ['DON-2026-000120', 'Collected', 'Your donation has been collected.', '13 Jun 2026', '11:00 AM', 1, 3],
    ['DON-2026-000120', 'Distributed', 'Your donation has been distributed to a family in need.', '14 Jun 2026', '03:00 PM', 1, 4],
    ['DON-2026-000120', 'Completed', 'Thank you for your generosity!', '14 Jun 2026', '03:30 PM', 1, 5],
  ];
  for (const [donId, title, desc, date, time, done, order] of trackingSteps) {
    stmts.push({
      sql: `INSERT INTO donation_tracking (id, donation_id, step_title, step_description, step_date, step_time, is_completed, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [`track-${donId}-${order}`, donId, title, desc, date, time, done, order],
    });
  }

  const journeyPhotos: [string, string, string][] = [
    ['DON-2026-000123', 'collected', 'collected-photo'],
    ['DON-2026-000123', 'delivery', 'delivery-photo'],
    ['DON-2026-000122', 'collected', 'collected-photo'],
    ['DON-2026-000121', 'collected', 'collected-photo'],
    ['DON-2026-000121', 'delivery', 'delivery-photo'],
    ['DON-2026-000120', 'collected', 'collected-photo'],
    ['DON-2026-000120', 'delivery', 'delivery-photo'],
  ];
  for (const [donId, type, key] of journeyPhotos) {
    stmts.push({
      sql: `INSERT INTO donation_photos (id, donation_id, photo_type, image_key) VALUES (?, ?, ?, ?)`,
      args: [`photo-${donId}-${type}`, donId, type, key],
    });
  }

  const storyData: [string, string, string, string, string, string][] = [
    ['story-1', 'Clothes', 'A warm smile and a new beginning', 'When we delivered warm clothes to the Sharma family, little Priya\'s smile reminded us why we do what we do.', 'Together with ManavSathi, donors like you are making a lasting difference in communities across India.', 'story-clothes'],
    ['story-2', 'Food', 'Nourishing hope in rural villages', 'Our food donation drive reached 200 families in remote villages, providing essential nutrition.', 'Every meal shared brings hope to a family in need.', 'story-food'],
    ['story-3', 'Books', 'Opening doors through education', 'Donated books helped set up a small library in a village school, inspiring young minds.', 'Education is the greatest gift we can give.', 'story-books'],
  ];
  for (const [id, cat, title, excerpt, content, imgKey] of storyData) {
    stmts.push({
      sql: `INSERT INTO stories (id, category, title, excerpt, content, image_key) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, cat, title, excerpt, content, imgKey],
    });
  }

  const notifs: [string, string, string, string, number, string][] = [
    ['notif-1', 'completed', 'Donation Completed', 'Your donation DON-2026-000123 has been completed successfully.', 0, '-2 hours'],
    ['notif-2', 'pickup', 'Pickup Scheduled', 'Volunteer Rohit will collect your items on 04 Jul between 10 AM - 12 PM.', 0, '-1 day'],
    ['notif-3', 'accepted', 'Donation Accepted', 'ManavSathi has accepted your clothes donation request.', 1, '-2 days'],
    ['notif-4', 'submitted', 'Donation Submitted', 'Your donation request DON-2026-000122 has been submitted.', 1, '-3 days'],
  ];
  for (const [id, type, title, body, read, offset] of notifs) {
    stmts.push({
      sql: `INSERT INTO notifications (id, user_id, type, title, body, read, created_at) VALUES (?, 'user-sulaiman', ?, ?, ?, ?, datetime('now', ?))`,
      args: [id, type, title, body, read, offset],
    });
  }

  stmts.push({
    sql: `INSERT INTO notification_settings (user_id) VALUES ('user-sulaiman')`,
    args: [],
  });

  stmts.push({
    sql: `INSERT INTO app_meta (key, value) VALUES ('schema_version', ?)`,
    args: [String(SCHEMA_VERSION)],
  });

  return stmts;
}

export async function initDatabase(): Promise<void> {
  const c = getClient();

  // Check current schema version; skip all seeding if already up to date.
  let currentVersion = 0;
  try {
    const res = await c.execute("SELECT value FROM app_meta WHERE key = 'schema_version'");
    if (res.rows.length > 0) currentVersion = parseInt(res.rows[0].value as string, 10) || 0;
  } catch {
    currentVersion = 0; // app_meta doesn't exist yet
  }

  if (currentVersion === SCHEMA_VERSION) return;

  // Version mismatch (or fresh/legacy DB): reset schema and reseed once.
  try {
    await c.executeMultiple(DROP_DDL);
  } catch {
    // Fallback: drop each table individually so one stubborn table can't
    // block the whole reset (FK enforcement disabled first).
    try { await c.execute('PRAGMA foreign_keys=OFF'); } catch { /* ignore */ }
    for (const t of DROP_ORDER) {
      try { await c.execute(`DROP TABLE IF EXISTS ${t}`); } catch { /* ignore */ }
    }
  }

  await c.executeMultiple(SCHEMA_DDL);
  await c.batch(buildSeedStatements(), 'write');
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    avatar: row.avatar as string | null,
    bio: row.bio as string | null,
    phone: row.phone as string | null,
    created_at: row.created_at as string,
  };
}

function mapItemDonation(row: Record<string, unknown>): ItemDonation {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    category_id: row.category_id as string,
    category_name: row.category_name as string,
    category_icon: row.category_icon as string,
    category_color: row.category_color as string,
    quantity: row.quantity as number,
    condition: row.condition as string,
    description: row.description as string | null,
    status: row.status as DonationStatus,
    image_key: row.image_key as string | null,
    pickup_address: row.pickup_address as string,
    pickup_date: row.pickup_date as string | null,
    pickup_time: row.pickup_time as string | null,
    contact_number: row.contact_number as string | null,
    volunteer_id: row.volunteer_id as string | null,
    volunteer_name: row.volunteer_name as string | null,
    volunteer_phone: row.volunteer_phone as string | null,
    delivery_date: row.delivery_date as string | null,
    created_at: row.created_at as string,
  };
}

export const db = {
  async signUp(name: string, email: string, password: string): Promise<User> {
    const c = getClient();
    const existing = await c.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email.toLowerCase()] });
    if (existing.rows.length > 0) throw new Error('An account with this email already exists');
    const id = generateId();
    await c.execute({
      sql: 'INSERT INTO users (id, name, email, password, avatar) VALUES (?, ?, ?, ?, ?)',
      args: [id, name, email.toLowerCase(), password, 'avatar-sulaiman'],
    });
    await c.execute({ sql: 'INSERT INTO notification_settings (user_id) VALUES (?)', args: [id] });
    return { id, name, email: email.toLowerCase(), avatar: 'avatar-sulaiman', bio: null, phone: null, created_at: new Date().toISOString() };
  },

  async login(email: string, password: string): Promise<User> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT * FROM users WHERE email = ? AND password = ?',
      args: [email.toLowerCase(), password],
    });
    if (result.rows.length === 0) throw new Error('Invalid email or password');
    return mapUser(result.rows[0] as Record<string, unknown>);
  },

  async getUserById(id: string): Promise<User | null> {
    const c = getClient();
    const result = await c.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return null;
    return mapUser(result.rows[0] as Record<string, unknown>);
  },

  async updateUser(id: string, updates: { name?: string; bio?: string; avatar?: string; phone?: string }): Promise<void> {
    const c = getClient();
    const sets: string[] = [];
    const args: (string | null)[] = [];
    if (updates.name !== undefined) { sets.push('name = ?'); args.push(updates.name); }
    if (updates.bio !== undefined) { sets.push('bio = ?'); args.push(updates.bio); }
    if (updates.avatar !== undefined) { sets.push('avatar = ?'); args.push(updates.avatar); }
    if (updates.phone !== undefined) { sets.push('phone = ?'); args.push(updates.phone); }
    if (sets.length === 0) return;
    args.push(id);
    await c.execute({ sql: `UPDATE users SET ${sets.join(', ')} WHERE id = ?`, args });
  },

  async getItemCategories(): Promise<ItemCategory[]> {
    const c = getClient();
    const result = await c.execute('SELECT * FROM item_categories ORDER BY sort_order');
    return result.rows.map(r => ({
      id: r.id as string, name: r.name as string, icon: r.icon as string,
      color: r.color as string, sort_order: r.sort_order as number,
    }));
  },

  async getImpactStats(): Promise<ImpactStats> {
    const fallback: ImpactStats = {
      total_volunteers: '850+', families_helped: '8,320+', items_donated: '18,750+',
      lives_impacted: '6,980+', communities_reached: '120+',
    };
    try {
      const c = getClient();
      const result = await c.execute("SELECT * FROM impact_stats WHERE id = 'global'");
      const row = result.rows[0];
      if (!row) return fallback;
      return {
        total_volunteers: row.total_volunteers as string,
        families_helped: row.families_helped as string,
        items_donated: row.items_donated as string,
        lives_impacted: row.lives_impacted as string,
        communities_reached: row.communities_reached as string,
      };
    } catch {
      return fallback;
    }
  },

  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC',
      args: [userId],
    });
    return result.rows.map(r => ({
      id: r.id as string, user_id: r.user_id as string,
      label: r.label as string, address: r.address as string,
      contact_number: r.contact_number as string | null,
      latitude: r.latitude as number | null,
      longitude: r.longitude as number | null,
      is_default: r.is_default as number,
    }));
  },

  async getDefaultAddress(userId: string): Promise<UserAddress | null> {
    const addresses = await this.getUserAddresses(userId);
    return addresses.find(a => a.is_default) || addresses[0] || null;
  },

  async addAddress(
    userId: string,
    label: string,
    address: string,
    isDefault = false,
    contactNumber?: string,
    latitude?: number | null,
    longitude?: number | null,
  ): Promise<string> {
    const c = getClient();
    const id = generateId();
    if (isDefault) {
      await c.execute({ sql: 'UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', args: [userId] });
    }
    await c.execute({
      sql: 'INSERT INTO user_addresses (id, user_id, label, address, contact_number, latitude, longitude, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [id, userId, label, address, contactNumber || null, latitude ?? null, longitude ?? null, isDefault ? 1 : 0],
    });
    return id;
  },

  async getItemDonations(userId: string, statusFilter?: 'all' | 'pending' | 'completed'): Promise<ItemDonation[]> {
    const c = getClient();
    let sql = `SELECT d.*, c.name as category_name, c.icon as category_icon, c.color as category_color
               FROM item_donations d JOIN item_categories c ON d.category_id = c.id
               WHERE d.user_id = ?`;
    const args: string[] = [userId];
    if (statusFilter === 'pending') {
      sql += " AND d.status IN ('pending', 'collected', 'distributed')";
    } else if (statusFilter === 'completed') {
      sql += " AND d.status = 'completed'";
    }
    sql += ' ORDER BY d.created_at DESC';
    const result = await c.execute({ sql, args });
    return result.rows.map(r => mapItemDonation(r as Record<string, unknown>));
  },

  async getItemDonationById(id: string): Promise<ItemDonation | null> {
    const c = getClient();
    const result = await c.execute({
      sql: `SELECT d.*, c.name as category_name, c.icon as category_icon, c.color as category_color
            FROM item_donations d JOIN item_categories c ON d.category_id = c.id WHERE d.id = ?`,
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return mapItemDonation(result.rows[0] as Record<string, unknown>);
  },

  async getDonationTracking(donationId: string): Promise<DonationTrackingStep[]> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT * FROM donation_tracking WHERE donation_id = ? ORDER BY sort_order',
      args: [donationId],
    });
    return result.rows.map(r => ({
      id: r.id as string, donation_id: r.donation_id as string,
      step_title: r.step_title as string, step_description: r.step_description as string | null,
      step_date: r.step_date as string | null, step_time: r.step_time as string | null,
      is_completed: r.is_completed as number, sort_order: r.sort_order as number,
    }));
  },

  async getDonationPhotos(donationId: string): Promise<DonationPhoto[]> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT * FROM donation_photos WHERE donation_id = ?',
      args: [donationId],
    });
    return result.rows.map(r => ({
      id: r.id as string, donation_id: r.donation_id as string,
      photo_type: r.photo_type as DonationPhoto['photo_type'], image_key: r.image_key as string,
    }));
  },

  async submitItemDonation(data: {
    user_id: string;
    category_id: string;
    quantity: number;
    condition: string;
    description: string;
    pickup_address: string;
    pickup_date: string;
    pickup_time: string;
    contact_number: string;
    photo_uris?: string[];
  }): Promise<string> {
    const c = getClient();
    const id = generateDonationId();
    const catResult = await c.execute({ sql: 'SELECT name FROM item_categories WHERE id = ?', args: [data.category_id] });
    const catName = (catResult.rows[0]?.name as string) || 'Others';
    const imageKey = `donation-${catName.toLowerCase()}`;

    await c.execute({
      sql: `INSERT INTO item_donations (id, user_id, category_id, quantity, condition, description, status, image_key, pickup_address, pickup_date, pickup_time, contact_number)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      args: [id, data.user_id, data.category_id, data.quantity, data.condition, data.description, imageKey, data.pickup_address, data.pickup_date, data.pickup_time, data.contact_number],
    });

    const steps = [
      ['Submitted', 'Your donation request has been submitted.', 1],
      ['Accepted by ManavSathi', 'Awaiting verification.', 0],
    ];
    for (let i = 0; i < steps.length; i++) {
      const [title, desc, done] = steps[i];
      await c.execute({
        sql: `INSERT INTO donation_tracking (id, donation_id, step_title, step_description, step_date, step_time, is_completed, sort_order) VALUES (?, ?, ?, ?, date('now'), time('now'), ?, ?)`,
        args: [generateId(), id, title, desc, done, i],
      });
    }

    if (data.photo_uris?.length) {
      for (const uri of data.photo_uris) {
        await c.execute({
          sql: 'INSERT INTO donation_photos (id, donation_id, photo_type, image_key) VALUES (?, ?, ?, ?)',
          args: [generateId(), id, 'upload', uri],
        });
      }
    }

    await c.execute({
      sql: 'INSERT INTO notifications (id, user_id, type, title, body) VALUES (?, ?, ?, ?, ?)',
      args: [generateId(), data.user_id, 'submitted', 'Donation Submitted', `Your donation request ${id} has been submitted.`],
    });

    return id;
  },

  async getStories(category?: string): Promise<Story[]> {
    const c = getClient();
    let sql = 'SELECT * FROM stories';
    const args: string[] = [];
    if (category && category !== 'All' && category !== 'More') {
      sql += ' WHERE category = ?';
      args.push(category);
    }
    sql += ' ORDER BY created_at DESC';
    const result = await c.execute({ sql, args });
    return result.rows.map(r => ({
      id: r.id as string, category: r.category as string, title: r.title as string,
      excerpt: r.excerpt as string, content: r.content as string,
      image_key: r.image_key as string, created_at: r.created_at as string,
    }));
  },

  async getStoryById(id: string): Promise<Story | null> {
    const c = getClient();
    const result = await c.execute({ sql: 'SELECT * FROM stories WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return null;
    const r = result.rows[0];
    return {
      id: r.id as string, category: r.category as string, title: r.title as string,
      excerpt: r.excerpt as string, content: r.content as string,
      image_key: r.image_key as string, created_at: r.created_at as string,
    };
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      args: [userId],
    });
    return result.rows.map(r => ({
      id: r.id as string, user_id: r.user_id as string, type: r.type as string,
      title: r.title as string, body: r.body as string | null,
      read: r.read as number, created_at: r.created_at as string,
    }));
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    const c = getClient();
    await c.execute({ sql: 'UPDATE notifications SET read = 1 WHERE user_id = ?', args: [userId] });
  },

  async getUnreadCount(userId: string): Promise<number> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0',
      args: [userId],
    });
    return result.rows[0].count as number;
  },

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    const c = getClient();
    const result = await c.execute({ sql: 'SELECT * FROM notification_settings WHERE user_id = ?', args: [userId] });
    if (result.rows.length === 0) {
      await c.execute({ sql: 'INSERT INTO notification_settings (user_id) VALUES (?)', args: [userId] });
      return { user_id: userId, donation_updates: 1, pickup_alerts: 1, impact_stories: 1, promotional: 0 };
    }
    const r = result.rows[0];
    return {
      user_id: r.user_id as string, donation_updates: r.donation_updates as number,
      pickup_alerts: r.pickup_alerts as number, impact_stories: r.impact_stories as number,
      promotional: r.promotional as number,
    };
  },

  async updateNotificationSettings(userId: string, settings: Partial<Omit<NotificationSettings, 'user_id'>>): Promise<void> {
    const c = getClient();
    const sets: string[] = [];
    const args: (string | number)[] = [];
    if (settings.donation_updates !== undefined) { sets.push('donation_updates = ?'); args.push(settings.donation_updates); }
    if (settings.pickup_alerts !== undefined) { sets.push('pickup_alerts = ?'); args.push(settings.pickup_alerts); }
    if (settings.impact_stories !== undefined) { sets.push('impact_stories = ?'); args.push(settings.impact_stories); }
    if (settings.promotional !== undefined) { sets.push('promotional = ?'); args.push(settings.promotional); }
    if (sets.length === 0) return;
    args.push(userId);
    await c.execute({ sql: `UPDATE notification_settings SET ${sets.join(', ')} WHERE user_id = ?`, args });
  },

  async adminLogin(email: string, password: string): Promise<User> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT * FROM users WHERE email = ? AND password = ? AND is_admin = 1',
      args: [email.toLowerCase(), password],
    });
    if (result.rows.length === 0) throw new Error('Invalid admin credentials');
    return mapUser(result.rows[0] as Record<string, unknown>);
  },

  async getVolunteers(): Promise<Volunteer[]> {
    const c = getClient();
    const result = await c.execute('SELECT id, name, phone, email, is_active FROM volunteers WHERE is_active = 1 ORDER BY name');
    return result.rows.map(r => ({
      id: r.id as string,
      name: r.name as string,
      phone: r.phone as string,
      email: r.email as string | null,
      is_active: r.is_active as number,
    }));
  },

  async volunteerLogin(email: string, password: string): Promise<Volunteer> {
    const c = getClient();
    const result = await c.execute({
      sql: 'SELECT id, name, phone, email, is_active FROM volunteers WHERE email = ? AND password = ? AND is_active = 1',
      args: [email.toLowerCase(), password],
    });
    if (result.rows.length === 0) throw new Error('Invalid volunteer credentials');
    const r = result.rows[0];
    return {
      id: r.id as string,
      name: r.name as string,
      phone: r.phone as string,
      email: r.email as string | null,
      is_active: r.is_active as number,
    };
  },

  async addVolunteer(name: string, phone: string, email: string, password: string): Promise<Volunteer> {
    const c = getClient();
    const id = generateId();
    await c.execute({
      sql: 'INSERT INTO volunteers (id, name, phone, email, password, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      args: [id, name, phone, email.toLowerCase(), password],
    });
    return { id, name, phone, email: email.toLowerCase(), is_active: 1 };
  },

  async getDonationsForVolunteer(volunteerId: string): Promise<AdminDonation[]> {
    const c = getClient();
    const result = await c.execute({
      sql: `SELECT d.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
            u.name as donor_name, u.email as donor_email, u.phone as donor_phone
            FROM item_donations d
            JOIN item_categories c ON d.category_id = c.id
            JOIN users u ON d.user_id = u.id
            WHERE d.volunteer_id = ?
            ORDER BY d.created_at DESC`,
      args: [volunteerId],
    });
    return result.rows.map(r => ({
      ...mapItemDonation(r as Record<string, unknown>),
      donor_name: r.donor_name as string,
      donor_email: r.donor_email as string,
      donor_phone: r.donor_phone as string | null,
    }));
  },

  async getAllDonationsForAdmin(statusFilter?: DonationStatus | 'all'): Promise<AdminDonation[]> {
    const c = getClient();
    let sql = `SELECT d.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
               u.name as donor_name, u.email as donor_email, u.phone as donor_phone
               FROM item_donations d
               JOIN item_categories c ON d.category_id = c.id
               JOIN users u ON d.user_id = u.id`;
    const args: string[] = [];
    if (statusFilter && statusFilter !== 'all') {
      sql += ' WHERE d.status = ?';
      args.push(statusFilter);
    }
    sql += ' ORDER BY d.created_at DESC';
    const result = await c.execute({ sql, args });
    return result.rows.map(r => ({
      ...mapItemDonation(r as Record<string, unknown>),
      donor_name: r.donor_name as string,
      donor_email: r.donor_email as string,
      donor_phone: r.donor_phone as string | null,
    }));
  },

  async assignVolunteer(donationId: string, volunteerId: string): Promise<void> {
    const c = getClient();
    const vol = await c.execute({ sql: 'SELECT name, phone FROM volunteers WHERE id = ?', args: [volunteerId] });
    if (vol.rows.length === 0) throw new Error('Volunteer not found');
    const name = vol.rows[0].name as string;
    const phone = vol.rows[0].phone as string;
    await c.execute({
      sql: 'UPDATE item_donations SET volunteer_id = ?, volunteer_name = ?, volunteer_phone = ? WHERE id = ?',
      args: [volunteerId, name, phone, donationId],
    });
    const don = await this.getItemDonationById(donationId);
    if (don) {
      await c.execute({
        sql: `UPDATE donation_tracking SET is_completed = 1, step_date = date('now'), step_time = time('now')
              WHERE donation_id = ? AND step_title = 'Pickup Scheduled'`,
        args: [donationId],
      });
      const existing = await c.execute({
        sql: `SELECT id FROM donation_tracking WHERE donation_id = ? AND step_title = 'Pickup Scheduled'`,
        args: [donationId],
      });
      if (existing.rows.length === 0) {
        await c.execute({
          sql: `INSERT INTO donation_tracking (id, donation_id, step_title, step_description, step_date, step_time, is_completed, sort_order)
                VALUES (?, ?, 'Pickup Scheduled', ?, date('now'), time('now'), 1, 2)`,
          args: [generateId(), donationId, `Volunteer ${name} assigned for pickup.`],
        });
      }
      await c.execute({
        sql: 'INSERT INTO notifications (id, user_id, type, title, body) VALUES (?, ?, ?, ?, ?)',
        args: [generateId(), don.user_id, 'pickup', 'Volunteer Assigned', `${name} will collect your items. Contact: ${phone}`],
      });
    }
  },

  async updateDonationStatus(donationId: string, status: DonationStatus): Promise<void> {
    const c = getClient();
    const updates: Record<DonationStatus, string | null> = {
      pending: null,
      collected: 'Collected',
      distributed: 'Distributed',
      completed: 'Completed',
    };
    const stepTitle = updates[status];
    await c.execute({ sql: 'UPDATE item_donations SET status = ? WHERE id = ?', args: [status, donationId] });
    if (status === 'completed') {
      await c.execute({ sql: `UPDATE item_donations SET delivery_date = date('now') WHERE id = ?`, args: [donationId] });
    }
    if (stepTitle) {
      await c.execute({
        sql: `UPDATE donation_tracking SET is_completed = 1, step_date = date('now'), step_time = time('now')
              WHERE donation_id = ? AND step_title = ?`,
        args: [donationId, stepTitle],
      });
    }
    const don = await this.getItemDonationById(donationId);
    if (don) {
      const titles: Record<DonationStatus, string> = {
        pending: 'Donation Pending',
        collected: 'Items Collected',
        distributed: 'Items Distributed',
        completed: 'Donation Completed',
      };
      await c.execute({
        sql: 'INSERT INTO notifications (id, user_id, type, title, body) VALUES (?, ?, ?, ?, ?)',
        args: [generateId(), don.user_id, status, titles[status], `Your donation ${donationId} is now ${status}.`],
      });
    }
  },

  async acceptDonation(donationId: string): Promise<void> {
    const c = getClient();
    await c.execute({
      sql: `UPDATE donation_tracking SET is_completed = 1, step_date = date('now'), step_time = time('now')
            WHERE donation_id = ? AND step_title = 'Accepted by ManavSathi'`,
      args: [donationId],
    });
    const existing = await c.execute({
      sql: `SELECT id FROM donation_tracking WHERE donation_id = ? AND step_title = 'Accepted by ManavSathi'`,
      args: [donationId],
    });
    if (existing.rows.length === 0) {
      await c.execute({
        sql: `INSERT INTO donation_tracking (id, donation_id, step_title, step_description, step_date, step_time, is_completed, sort_order)
              VALUES (?, ?, 'Accepted by ManavSathi', 'ManavSathi team has accepted your donation.', date('now'), time('now'), 1, 1)`,
        args: [generateId(), donationId],
      });
    }
    const don = await this.getItemDonationById(donationId);
    if (don) {
      await c.execute({
        sql: 'INSERT INTO notifications (id, user_id, type, title, body) VALUES (?, ?, ?, ?, ?)',
        args: [generateId(), don.user_id, 'accepted', 'Donation Accepted', `ManavSathi has accepted your ${don.category_name} donation.`],
      });
    }
  },
};

const SESSION_KEY = 'manavsathi_session';

const webStorage = {
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') localStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') localStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  },
};

export async function saveSession(userId: string): Promise<void> {
  await webStorage.setItemAsync(SESSION_KEY, userId);
}

export async function getSession(): Promise<string | null> {
  return webStorage.getItemAsync(SESSION_KEY);
}

export async function clearSession(): Promise<void> {
  await webStorage.deleteItemAsync(SESSION_KEY);
}

const VOLUNTEER_SESSION_KEY = 'manavsathi_volunteer_session';

export async function saveVolunteerSession(volunteerId: string): Promise<void> {
  await webStorage.setItemAsync(VOLUNTEER_SESSION_KEY, volunteerId);
}

export async function getVolunteerSession(): Promise<string | null> {
  return webStorage.getItemAsync(VOLUNTEER_SESSION_KEY);
}

export async function clearVolunteerSession(): Promise<void> {
  await webStorage.deleteItemAsync(VOLUNTEER_SESSION_KEY);
}

const ADMIN_SESSION_KEY = 'manavsathi_admin_session';

export async function saveAdminSession(userId: string): Promise<void> {
  await webStorage.setItemAsync(ADMIN_SESSION_KEY, userId);
}

export async function getAdminSession(): Promise<string | null> {
  return webStorage.getItemAsync(ADMIN_SESSION_KEY);
}

export async function clearAdminSession(): Promise<void> {
  await webStorage.deleteItemAsync(ADMIN_SESSION_KEY);
}

export function formatDonationDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatNotifTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} minutes ago`;
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`;
  return formatDonationDate(dateStr);
}
