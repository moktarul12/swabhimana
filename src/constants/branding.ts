export const APP_NAME = 'ManavSathi';
export const APP_TAGLINE = 'Together, we change lives';
export const APP_DOMAIN = 'ManavSathi.com';
export const APP_URL = 'https://manavsathi.com';
export const APP_SCHEME = 'manavsathi';

export const DEMO_USER = {
  name: 'Sulaiman Shariff',
  email: 'sulaiman@manavsathis.com',
  password: 'password123',
  phone: '+91 8197479540',
};

export const ADMIN_USER = {
  email: 'admin@manavsathis.com',
  password: 'admin123',
};

export const VOLUNTEER_USER = {
  name: 'Rohit Sharma',
  email: 'rohit@manavsathis.com',
  password: 'volunteer123',
};

export const CONTACT = {
  name: 'Sulaiman Shariff',
  phone: '+91 8197479540',
  phoneRaw: '8197479540',
  email: 'support@manavsathis.com',
  address: 'Koramangala 8th Block, Rajendra Nagar, Bengaluru - 560096',
};

export const ABOUT_INTRO =
  'ManavSathi is a social impact platform built on a simple belief: every act of kindness has the power to change a life.';

export const ABOUT_PARAGRAPHS = [
  'Our mission is to connect people who want to help with people who genuinely need support. Whether it\'s food, education, healthcare, emergency assistance, volunteering, or community initiatives, ManavSathi creates a trusted space where compassion turns into meaningful action.',
  'We believe humanity grows stronger when people stand together. Every donation, every helping hand, every hour volunteered, and every smile shared creates a ripple of hope that reaches far beyond one person.',
  'At ManavSathi, we are committed to transparency, trust, and dignity. We strive to ensure that every contribution reaches the right people and creates a lasting impact.',
  'We are not just building a platform—we are building a community where kindness becomes a way of life.',
];

export const VISION =
  'To create a world where everyone has someone to rely on, and where helping others becomes simple, trusted, and accessible to all.';

export const MISSION =
  'To empower individuals, communities, and organizations to make a positive difference by connecting compassion with action through technology.';

export const MOTTO = 'Together for Humanity. Together with ManavSathi.';

export const ABOUT_PILLARS = [
  { icon: 'fast-food-outline' as const, title: 'Food & Nutrition', desc: 'Meals and rations for families facing hunger.' },
  { icon: 'school-outline' as const, title: 'Education', desc: 'Books, supplies and learning for every child.' },
  { icon: 'medkit-outline' as const, title: 'Healthcare', desc: 'Medical camps and emergency health support.' },
  { icon: 'people-outline' as const, title: 'Volunteering', desc: 'Mobilizing caring hands across communities.' },
  { icon: 'heart-outline' as const, title: 'Emergency Aid', desc: 'Rapid response when people need help most.' },
  { icon: 'home-outline' as const, title: 'Community', desc: 'Local initiatives that uplift neighbourhoods.' },
];

export const ABOUT_VALUES = [
  { icon: 'shield-checkmark-outline' as const, label: 'Transparency' },
  { icon: 'hand-left-outline' as const, label: 'Trust' },
  { icon: 'ribbon-outline' as const, label: 'Dignity' },
  { icon: 'sparkles-outline' as const, label: 'Impact' },
];

/** @deprecated use ABOUT_PARAGRAPHS joined */
export const ABOUT_MANAVSAATHI = [ABOUT_INTRO, ...ABOUT_PARAGRAPHS].join('\n\n');
