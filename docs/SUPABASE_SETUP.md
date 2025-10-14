# Supabase Setup Guide

This guide walks you through setting up Supabase for the Dance Competition App.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in the project details:
   - Project name: `dance-competition-app` (or your preferred name)
   - Database password: Choose a strong password (save this!)
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for setup to complete (1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the "Settings" icon (gear) in the sidebar
2. Navigate to "API" section
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit your `.env` file to version control!

## Step 4: Set Up Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. In your Supabase project, navigate to the "SQL Editor" in the sidebar
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
6. Verify success - you should see "Success. No rows returned"
7. Navigate to "Table Editor" to confirm all tables were created:
   - `users`
   - `videos`
   - `leaderboard`

### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (get project ref from dashboard URL):
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push the migration:
   ```bash
   supabase db push
   ```

## Step 5: Verify Setup

1. In Supabase dashboard, go to "Table Editor"
2. You should see three tables:
   - **users**: For user profiles
   - **videos**: For video metadata
   - **leaderboard**: For competition rankings

3. Click on each table to verify the columns match the schema

## Step 6: Test the Connection

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. The app should now be able to connect to Supabase
3. Check the console for any connection errors

## Troubleshooting

### "Missing EXPO_PUBLIC_SUPABASE_URL environment variable"

- Ensure your `.env` file exists in the project root
- Verify the variable names match exactly (including `EXPO_PUBLIC_` prefix)
- Restart your development server after creating/modifying `.env`

### "Invalid API key"

- Double-check you copied the **anon public** key, not the service role key
- Ensure there are no extra spaces or line breaks in the key
- Verify the key in your Supabase dashboard hasn't been regenerated

### Tables not created

- Check the SQL Editor for error messages
- Ensure you ran the entire migration script
- Verify you have the correct permissions on your Supabase project

### RLS Policies blocking access

- Ensure you're using an authenticated user token
- Check that RLS policies are correctly set up in the migration
- For testing, you can temporarily disable RLS on a table (not recommended for production)

## Next Steps

After successful setup:

1. ✅ Database schema is created
2. ✅ Supabase client is configured
3. ✅ TypeScript types are defined
4. 🔄 Next: Implement authentication service (Task 3)
5. 🔄 Seed sample data for testing (Task 6.3)

## Security Notes

- **Never** commit your `.env` file
- **Never** expose your service role key in client code
- Always use the anon public key in the React Native app
- Row Level Security (RLS) is enabled on all tables for security
- Keep your Supabase project password secure

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
