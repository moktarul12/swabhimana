# ShareHope - NGO Donation App

A React Native mobile app for making donations to various charitable causes, built with Expo and Turso database.

## Package Name
`com.dromominds.sharehope`

## Tech Stack
- React Native (Expo SDK 57)
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- Turso Database (libsql)
- Expo Vector Icons (Ionicons)

## Features
- **Home Screen**: Browse donation categories (Education, Healthcare, Food, Shelter, Environment, Emergency)
- **Donation Details**: View category details and donation statistics
- **Donation Form**: Make secure donations with custom amounts
- **Donation History**: Track all past donations
- **Profile**: Manage user profile and view donation statistics

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Turso Database
Create a free account at [turso.tech](https://turso.tech) and create a database.

Then update the `.env` file with your Turso credentials:
```env
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 3. Run the App
```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### 4. Build for Production with EAS

Install EAS CLI (if not already installed):
```bash
npm install -g eas-cli
```

Login to your Expo account:
```bash
eas login
```

Configure the project:
```bash
eas build:configure
```

Build for Android:
```bash
eas build --platform android
```

Build for iOS:
```bash
eas build --platform ios
```

## Database Schema

### Categories
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- icon (TEXT)
- color (TEXT)
- description (TEXT)

### Donations
- id (INTEGER, PRIMARY KEY)
- category_id (INTEGER, FOREIGN KEY)
- amount (REAL)
- donor_name (TEXT)
- donor_email (TEXT)
- message (TEXT)
- created_at (DATETIME)

### Users
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- email (TEXT, UNIQUE)
- phone (TEXT)
- total_donated (REAL)
- created_at (DATETIME)

## Screens

### Home Screen
- Welcome message
- Total donations statistics
- Category grid with icons
- Impact information

### Donation Detail Screen
- Category information
- Donation statistics (total raised, number of donations)
- Pre-set donation amounts (₹50, ₹100, ₹500, ₹1000, ₹5000)
- Custom amount option
- Security and tax benefit information

### Donation Form Screen
- Category details
- Amount input
- Donor name and email
- Optional message
- Secure donation button

### History Screen
- List of all donations
- Category, amount, date, and message
- Donation status

### Profile Screen
- User profile management
- Total donation statistics
- Menu items (Receipts, Payment Methods, Notifications, Help, About, Logout)

## Color Scheme
- Primary: #E6F4FE (Light Blue)
- Secondary: Various category colors
- Background: #FFFFFF
- Text: #333333

## Icons
Using Ionicons from @expo/vector-icons for all UI icons.

## License
MIT
