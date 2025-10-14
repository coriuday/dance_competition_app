# Supabase Database Setup

This directory contains the database schema and migration files for the Dance Competition App.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Note your project URL and anon key from the project settings

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste into the SQL Editor and click "Run"
5. Verify that all tables were created successfully in the Table Editor

### Option 2: Using Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply the migration:
   ```bash
   supabase db push
   ```

## Database Schema

### Tables

#### `users`
Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | User email (unique) |
| username | TEXT | Username (unique) |
| avatar_url | TEXT | URL to user avatar image |
| created_at | TIMESTAMP | Account creation timestamp |

#### `videos`
Stores video metadata with external URLs.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Video title |
| description | TEXT | Video description |
| video_url | TEXT | External URL to video file |
| thumbnail_url | TEXT | URL to video thumbnail |
| user_id | UUID | Foreign key to users table |
| views | INTEGER | View count (default: 0) |
| likes | INTEGER | Like count (default: 0) |
| created_at | TIMESTAMP | Upload timestamp |

#### `leaderboard`
Stores competition entries with scores and rankings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users table |
| video_id | UUID | Foreign key to videos table |
| score | INTEGER | Competition score |
| rank | INTEGER | Calculated rank (auto-updated) |
| created_at | TIMESTAMP | Entry creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Users**: Can view all profiles, update only their own
- **Videos**: All authenticated users can view, users can manage their own videos
- **Leaderboard**: All authenticated users can view, system can insert/update entries

### Automatic Features

- **Rank Calculation**: Ranks are automatically recalculated when scores change
- **Updated Timestamp**: The `updated_at` field is automatically updated on changes
- **Cascading Deletes**: Deleting a user or video cascades to related records

## Environment Variables

After setting up your Supabase project, add these variables to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Seeding Sample Data

To populate the database with sample data for testing, you can run the seed scripts (to be created in future tasks).

## Troubleshooting

### Migration Fails
- Ensure you have the correct permissions
- Check that the UUID extension is available
- Verify no conflicting table names exist

### RLS Policies Not Working
- Ensure you're using an authenticated user token
- Check that RLS is enabled on all tables
- Verify policy conditions match your use case

## Next Steps

After setting up the database:
1. Configure the Supabase client in your app (see task 2.2)
2. Test the connection with a simple query
3. Seed sample data for development
