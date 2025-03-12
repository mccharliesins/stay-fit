# Supabase Setup for StayFit App

This directory contains the necessary SQL scripts and instructions to set up your Supabase project for the StayFit app.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project
3. Note your project URL and anon key (you'll need these for your app's environment variables)

### 2. Set Up Database Tables

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `schema.sql` from this directory
3. Paste it into a new SQL query in the SQL Editor
4. Run the query to create all necessary tables, policies, and triggers

### 3. Update Existing Database (If Needed)

If you're experiencing errors related to missing columns:

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `update_profile_table.sql` from this directory
3. Paste it into a new SQL query in the SQL Editor
4. Run the query to add any missing columns to your tables

### 4. Set Up Storage Buckets

1. In your Supabase dashboard, go to Storage
2. Create the following buckets:

   - `avatars` - for user profile pictures
   - `workout-images` - for workout-related images
   - `profile-images` - for profile images

3. Set the following bucket policies:

#### For all buckets (avatars, workout-images, profile-images):

- **Policy name**: Allow authenticated users to perform all operations
- **Allowed operations**: SELECT, INSERT, UPDATE, DELETE
- **Policy definition**: `auth.role() = 'authenticated'`

This is a simplified policy that allows any authenticated user to access the storage buckets. For production, you might want to use more restrictive policies as described below:

#### For the `avatars` bucket (more restrictive):

- **Policy name**: Allow users to select their own avatar
- **Allowed operations**: SELECT
- **Policy definition**: `auth.uid() = (SELECT id FROM profiles WHERE avatar_url LIKE '%' || storage.objects.name || '%')`

- **Policy name**: Allow users to insert their own avatar
- **Allowed operations**: INSERT
- **Policy definition**: `auth.uid() = (storage.objects.owner)`

- **Policy name**: Allow users to update their own avatar
- **Allowed operations**: UPDATE
- **Policy definition**: `auth.uid() = (storage.objects.owner)`

- **Policy name**: Allow users to delete their own avatar
- **Allowed operations**: DELETE
- **Policy definition**: `auth.uid() = (storage.objects.owner)`

### 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under Email Auth, make sure "Enable Email Signup" is turned on
3. Configure the Site URL to match your app's URL (for development, you can use the Expo URL)
4. Add any additional redirect URLs needed for password reset functionality

### 6. Update Environment Variables

Make sure your app's `.env` file contains the correct Supabase URL and anon key:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

If you encounter issues with the database setup:

1. **Missing tables**: Run the SQL script again to ensure all tables are created
2. **Missing columns**: Run the `update_profile_table.sql` script to add any missing columns
3. **Permission errors**: Make sure the Row Level Security (RLS) policies are correctly set up
4. **Storage errors**: Verify that the storage buckets exist and have the correct policies

For any other issues, check the Supabase documentation or contact support.
