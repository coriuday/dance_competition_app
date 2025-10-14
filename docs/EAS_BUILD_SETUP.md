# EAS Build Setup Guide

This guide explains how to set up and use Expo Application Services (EAS) Build for the Dance Competition App.

## Prerequisites

1. **Expo Account**: Create an account at [expo.dev](https://expo.dev)
2. **Node.js**: Version 18 or higher
3. **EAS CLI**: Install globally

## Installation

### 1. Install EAS CLI Globally

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

Enter your Expo account credentials when prompted.

### 3. Configure Your Project

The project already has an `eas.json` configuration file with three build profiles:

- **development**: For local development and testing
- **preview**: For internal testing and QA
- **production**: For app store releases

## Environment Variables

### Local Development

Create a `.env` file in the project root (already exists as `.env.example`):

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### EAS Build Environment Variables

Set environment variables in EAS using the CLI:

```bash
# Set Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value your_supabase_url

# Set Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your_supabase_anon_key
```

Or configure them in the Expo dashboard:
1. Go to [expo.dev](https://expo.dev)
2. Navigate to your project
3. Go to "Secrets" section
4. Add the required environment variables

## Build Profiles

### Development Build

For local development with custom native code:

```bash
cd dance-competition-app
eas build --profile development --platform ios
eas build --profile development --platform android
```

Features:
- Includes development client
- Supports hot reloading
- iOS simulator builds enabled
- Android APK format

### Preview Build

For internal testing and QA:

```bash
cd dance-competition-app
eas build --profile preview --platform all
```

Features:
- Internal distribution
- No simulator support
- Android APK format
- Suitable for TestFlight (iOS) or internal distribution

### Production Build

For app store releases:

```bash
cd dance-competition-app
eas build --profile production --platform all
```

Features:
- Optimized for production
- Android App Bundle (AAB) format
- Ready for App Store and Google Play submission

## Testing Builds Locally

### 1. Build for Development

```bash
cd dance-competition-app
eas build --profile development --platform android --local
```

The `--local` flag builds on your machine instead of EAS servers.

### 2. Install on Device

After the build completes:

**Android:**
```bash
adb install path/to/your-app.apk
```

**iOS:**
- Use Xcode or TestFlight to install the .ipa file

## CI/CD Integration

The project includes a GitHub Actions workflow (`.github/workflows/build-test.yml`) that:

1. Runs linting and type checking
2. Executes tests
3. Triggers EAS builds on push to main/develop branches

### Required GitHub Secrets

Add these secrets to your GitHub repository:

1. `EXPO_TOKEN`: Your Expo access token
   - Generate at: https://expo.dev/accounts/[username]/settings/access-tokens
   
2. `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL

3. `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

To add secrets:
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret

## Submission to App Stores

### iOS App Store

1. Update `eas.json` submit configuration with your Apple ID details
2. Run submission:

```bash
cd dance-competition-app
eas submit --platform ios --profile production
```

### Google Play Store

1. Create a service account key in Google Cloud Console
2. Update `eas.json` with the path to your service account key
3. Run submission:

```bash
cd dance-competition-app
eas submit --platform android --profile production
```

## Troubleshooting

### Build Fails with Environment Variable Errors

Ensure all required secrets are set in EAS:

```bash
eas secret:list
```

### iOS Build Fails

- Verify your Apple Developer account is properly configured
- Check that provisioning profiles are valid
- Ensure bundle identifier is unique

### Android Build Fails

- Verify your keystore is properly configured
- Check that package name is unique
- Ensure all required permissions are declared

## Useful Commands

```bash
# List all builds
eas build:list

# View build details
eas build:view [build-id]

# Cancel a build
eas build:cancel [build-id]

# List secrets
eas secret:list

# Delete a secret
eas secret:delete --name SECRET_NAME

# Configure project
eas build:configure
```

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Environment Variables in EAS](https://docs.expo.dev/build-reference/variables/)
- [GitHub Actions with EAS](https://docs.expo.dev/build/building-on-ci/)

## Notes

- First build may take longer as EAS sets up the build environment
- Builds are cached for faster subsequent builds
- Free tier includes limited build minutes; check your plan at expo.dev
- Keep your environment variables secure and never commit them to version control
