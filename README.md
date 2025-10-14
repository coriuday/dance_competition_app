# Dance Competition App 🕺💃

A short-form dance competition mobile application built with React Native, Expo, TypeScript, React-Query, Supabase, and Tailwind CSS. This prototype demonstrates modern mobile app development practices with a focus on clean architecture, type safety, and user experience.

## ✨ Features

### Authentication

- **User Registration**: Create an account with email and password
- **Secure Login**: Authenticate with Supabase Auth
- **Session Persistence**: Stay logged in across app restarts using expo-secure-store
- **Protected Routes**: Conditional navigation based on authentication state

### Video Feed

- **Vertical Scrolling**: TikTok-style vertical video feed
- **Auto-play**: Videos automatically play when in viewport
- **Auto-pause**: Videos pause when scrolled out of view
- **Like Functionality**: Like videos with optimistic UI updates
- **View Tracking**: Automatic view count increments
- **Loading States**: Smooth loading indicators and error handling
- **External Video URLs**: Videos loaded from external CDN sources

### Leaderboard

- **Competition Rankings**: View top performers sorted by score
- **Real-time Updates**: Auto-refresh every 30 seconds
- **User Profiles**: Display username, score, and rank
- **Visual Distinction**: Special styling for top 3 positions

### Technical Features

- **Type Safety**: Full TypeScript implementation with strict mode
- **State Management**: Zustand for global state, React-Query for server state
- **Caching Strategy**: Intelligent data caching with React-Query
- **Error Boundaries**: Graceful error handling throughout the app
- **Responsive Design**: Mobile-optimized UI with NativeWind (Tailwind CSS)
- **Clean Architecture**: Modular code structure with separation of concerns

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Expo](https://expo.dev/) SDK 54+ with React Native 0.81
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.9
- **Styling**: [NativeWind](https://www.nativewind.dev/) 4.2 (Tailwind CSS for React Native)
- **Navigation**: [React Navigation](https://reactnavigation.org/) 7.x (Stack & Bottom Tabs)
- **Video Playback**: [expo-av](https://docs.expo.dev/versions/latest/sdk/av/) 16.0

### State Management

- **Global State**: [Zustand](https://zustand-demo.pmnd.rs/) 5.0 - Lightweight state management
- **Server State**: [TanStack Query](https://tanstack.com/query/latest) (React-Query) 5.90 - Data fetching & caching
- **Secure Storage**: [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) 15.0 - Token persistence

### Backend

- **BaaS**: [Supabase](https://supabase.com/) - PostgreSQL database, Authentication, Row Level Security
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Supabase Auth with JWT tokens

### Development Tools

- **Build/Deploy**: Expo EAS Build & Submit
- **Package Manager**: npm
- **Version Control**: Git

## Project Structure

```
dance-competition-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components (Button, Input, etc.)
│   │   ├── video/          # Video-related components
│   │   └── leaderboard/    # Leaderboard components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── feed/           # Video feed screen
│   │   └── leaderboard/    # Leaderboard screen
│   ├── services/           # API and external services
│   │   └── api/            # API service functions
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── navigation/         # Navigation configuration
├── assets/                 # Static assets (images, fonts)
├── .env.example            # Environment variables template
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Mobile Development Environment**:
  - **iOS**: Xcode (macOS only) or Expo Go app on physical device
  - **Android**: Android Studio with emulator or Expo Go app on physical device
  - **Web**: Any modern browser (for web testing)
- **Supabase Account**: Free account at [supabase.com](https://supabase.com)
- **Git**: For version control ([Download](https://git-scm.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dance-competition-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Expo, React Navigation, Supabase client, React-Query, Zustand, and NativeWind.

### 3. Set Up Supabase Backend

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details (name, password, region)
4. Wait for project initialization (~2 minutes)

#### Get API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

#### Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Important**: Never commit your `.env` file to version control!

#### Set Up Database Schema

1. In Supabase dashboard, navigate to **SQL Editor**
2. Click **"New query"**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor and click **"Run"**
5. Verify success in **Table Editor** - you should see 3 tables:
   - `users` - User profiles
   - `videos` - Video metadata
   - `leaderboard` - Competition rankings

> 📖 For detailed Supabase setup instructions, see [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)

### 4. Seed Sample Data (Optional but Recommended)

To populate the database with sample videos and leaderboard data for testing:

```bash
# First, create a user account by running the app and registering
npm start

# Then seed videos
npx tsx scripts/seed-videos.ts

# Then seed leaderboard
npx tsx scripts/seed-leaderboard.ts
```

> 📖 For detailed seeding instructions, see [docs/SEEDING.md](./docs/SEEDING.md)

### 5. Run the App

```bash
# Start the Expo development server
npm start
```

Then choose your platform:

- **iOS Simulator**: Press `i` (macOS only)
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`
- **Physical Device**: Scan QR code with Expo Go app

The app will open with the login screen. Register a new account to get started!

## 📱 Environment Variables

The following environment variables are required:

| Variable                        | Description                        | Example                                   |
| ------------------------------- | ---------------------------------- | ----------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Your Supabase project URL          | `https://xxxxx.supabase.co`               |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> 💡 **Note**: The `EXPO_PUBLIC_` prefix makes these variables accessible in the Expo app at runtime.

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm start

# Run on specific platform
npm run ios        # iOS simulator (macOS only)
npm run android    # Android emulator
npm run web        # Web browser

# Development utilities
npm run type-check # Run TypeScript compiler check
npm run lint       # Run ESLint (if configured)
npm test           # Run tests (if configured)
```

### Development Workflow

1. **Start the dev server**: `npm start`
2. **Make changes**: Edit files in `src/`
3. **Hot reload**: Changes automatically reflect in the app
4. **Check types**: Run `npm run type-check` periodically
5. **Test features**: Use seeded data or create test accounts

### Debugging

- **React Native Debugger**: Press `j` in the terminal to open debugger
- **Console Logs**: Use `console.log()` - visible in terminal and debugger
- **Network Requests**: Monitor in React Native Debugger Network tab
- **Supabase Logs**: Check Supabase dashboard for database queries

## 🏗️ Architecture & Design Decisions

### Layered Architecture

The app follows a clean, layered architecture pattern:

```
Presentation Layer (Screens & Components)
           ↓
State Management Layer (Zustand & React-Query)
           ↓
Service Layer (API Services)
           ↓
Backend Layer (Supabase)
```

### State Management Strategy

- **Zustand**: Lightweight global state for authentication
  - User session data
  - Authentication status
  - Simple, minimal boilerplate
- **React-Query**: Server state management
  - Automatic caching (5 min for videos, 30s for leaderboard)
  - Background refetching
  - Optimistic updates for likes
  - Built-in loading and error states
- **React Hooks**: Local component state
  - Form inputs
  - UI toggles
  - Component-specific state

### Styling Approach

- **NativeWind**: Tailwind CSS for React Native
  - Utility-first CSS classes
  - Consistent spacing and colors
  - Responsive design utilities
  - Custom theme in `tailwind.config.js`

### Navigation Structure

```
App
├── AuthStack (Unauthenticated)
│   ├── LoginScreen
│   └── RegisterScreen
└── MainStack (Authenticated)
    └── BottomTabs
        ├── VideoFeedScreen
        └── LeaderboardScreen
```

- **Conditional Rendering**: Navigation switches based on auth state
- **Session Persistence**: Auth state persists across app restarts
- **Protected Routes**: Main stack only accessible when authenticated

### Data Fetching & Caching

- **React-Query Hooks**: Custom hooks for each data domain
  - `useAuth()` - Authentication mutations
  - `useVideos()` - Video feed queries
  - `useLeaderboard()` - Leaderboard queries
- **Caching Strategy**:
  - Videos: 5-minute stale time (less frequent updates)
  - Leaderboard: 30-second auto-refresh (real-time feel)
  - Optimistic updates for user interactions (likes)

### Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **JWT Tokens**: Secure authentication with Supabase Auth
- **Secure Storage**: Tokens stored in expo-secure-store (encrypted)
- **Environment Variables**: Sensitive keys never committed to repo

## 🚢 Deployment

### Using Expo EAS Build

Expo Application Services (EAS) provides cloud-based build and submission services.

#### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login to Expo

```bash
eas login
```

#### 3. Configure EAS

```bash
eas build:configure
```

This creates an `eas.json` file with build profiles (development, preview, production).

#### 4. Set Environment Variables

Add your Supabase credentials to EAS:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value your-url
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your-key
```

#### 5. Build for iOS/Android

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Build for both
eas build --platform all --profile production
```

#### 6. Submit to App Stores

```bash
# Submit to Apple App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

> 📖 For more details, see [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)

### CI/CD with GitHub Actions

The project includes a comprehensive CI/CD pipeline using GitHub Actions (`.github/workflows/build-test.yml`) that automatically:

- **Lints code**: Runs ESLint to check code quality
- **Type checks**: Validates TypeScript types
- **Runs tests**: Executes Jest tests with coverage reporting
- **Builds app**: Creates production/preview builds with EAS Build
- **Uploads artifacts**: Saves test coverage reports

#### Pipeline Stages

1. **Lint and Type Check** (runs on all pushes and PRs)
   - ESLint code quality checks
   - TypeScript type validation
   
2. **Test** (runs after linting passes)
   - Jest unit and integration tests
   - Coverage report generation
   - Artifact upload for coverage analysis

3. **Build** (runs only on push to main/develop)
   - Production build for `main` branch
   - Preview build for `develop` branch
   - Requires lint and test jobs to pass

#### Setup Instructions

1. **Add GitHub Secrets** (Settings → Secrets and variables → Actions):
   - `EXPO_TOKEN`: Your Expo access token ([Get it here](https://expo.dev/accounts/[username]/settings/access-tokens))
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

2. **Push to trigger**: The workflow runs automatically on push/PR to main or develop branches

3. **Monitor builds**: Check the "Actions" tab in your GitHub repository

> 📖 For detailed CI/CD documentation, see [docs/CI_CD_GUIDE.md](./docs/CI_CD_GUIDE.md) and [docs/EAS_BUILD_SETUP.md](./docs/EAS_BUILD_SETUP.md)

## 🔧 Troubleshooting

### Common Issues and Solutions

#### "Missing EXPO_PUBLIC_SUPABASE_URL environment variable"

**Cause**: Environment variables not loaded or incorrectly named.

**Solution**:

1. Ensure `.env` file exists in project root
2. Verify variable names match exactly (including `EXPO_PUBLIC_` prefix)
3. Restart the Expo dev server: Stop with `Ctrl+C`, then run `npm start` again
4. Clear cache: `npx expo start --clear`

#### "Invalid API key" or "Failed to connect to Supabase"

**Cause**: Incorrect Supabase credentials or network issues.

**Solution**:

1. Double-check you copied the **anon public** key (not service role key)
2. Verify no extra spaces or line breaks in the key
3. Confirm the Supabase URL format: `https://xxxxx.supabase.co`
4. Check your Supabase project is active in the dashboard
5. Verify your network connection

#### Videos Not Playing

**Cause**: Video URL issues, network problems, or codec incompatibility.

**Solution**:

1. Verify video URLs are publicly accessible
2. Check video format is supported (MP4 with H.264 codec recommended)
3. Test video URL in browser first
4. Check console for specific error messages
5. Ensure CORS is enabled on video hosting server

#### "No users found in database" (when seeding)

**Cause**: Database is empty, need to create a user first.

**Solution**:

1. Run the app: `npm start`
2. Register a new user account through the app
3. Then run the seed scripts:
   ```bash
   npx tsx scripts/seed-videos.ts
   npx tsx scripts/seed-leaderboard.ts
   ```

#### App Crashes on Startup

**Cause**: Various issues including corrupted cache, dependency problems, or code errors.

**Solution**:

1. Clear Expo cache: `npx expo start --clear`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
4. Check console for specific error messages
5. Verify all dependencies are installed correctly

#### TypeScript Errors

**Cause**: Type mismatches or missing type definitions.

**Solution**:

1. Run type check: `npm run type-check`
2. Ensure all dependencies have type definitions
3. Check `tsconfig.json` configuration
4. Restart TypeScript server in your IDE

#### Authentication Not Persisting

**Cause**: Issues with expo-secure-store or session management.

**Solution**:

1. Check `authStore.ts` is correctly configured
2. Verify expo-secure-store is installed
3. Clear app data and re-login
4. Check Supabase session expiration settings

#### Leaderboard Not Updating

**Cause**: React-Query cache or Supabase data issues.

**Solution**:

1. Check network tab for API calls
2. Verify leaderboard data exists in Supabase
3. Force refresh by pulling down on the screen
4. Check React-Query devtools (if installed)

### Getting Help

If you encounter issues not listed here:

1. **Check the logs**: Look for error messages in the terminal and console
2. **Review documentation**: See the `docs/` folder for detailed guides
3. **Supabase Dashboard**: Check for database errors or RLS policy issues
4. **GitHub Issues**: Search for similar issues or create a new one
5. **Expo Forums**: [forums.expo.dev](https://forums.expo.dev)
6. **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)

## 📚 Additional Documentation

Detailed documentation is available in the `docs/` folder:

- **[SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)**: Complete Supabase setup guide
- **[SEEDING.md](./docs/SEEDING.md)**: Database seeding instructions
- **[VIDEO_SERVICE.md](./docs/VIDEO_SERVICE.md)**: Video service implementation details
- **[LEADERBOARD_SERVICE.md](./docs/LEADERBOARD_SERVICE.md)**: Leaderboard service details
- **[ERROR_HANDLING.md](./docs/ERROR_HANDLING.md)**: Error handling strategy
- **[SESSION_PERSISTENCE.md](./docs/SESSION_PERSISTENCE.md)**: Session management details
- **[CI_CD_GUIDE.md](./docs/CI_CD_GUIDE.md)**: CI/CD pipeline and GitHub Actions setup
- **[EAS_BUILD_SETUP.md](./docs/EAS_BUILD_SETUP.md)**: EAS Build configuration and deployment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style
4. **Test your changes**: Ensure everything works
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes

### Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused
- Write meaningful commit messages

## 🎯 Project Status

This is a **prototype/MVP** demonstrating core functionality:

- ✅ User authentication (register/login)
- ✅ Video feed with auto-play
- ✅ Leaderboard display
- ✅ Supabase backend integration
- ✅ Session persistence
- ✅ Error handling
- ⏳ Video upload (future enhancement)
- ⏳ Real-time voting (future enhancement)
- ⏳ Push notifications (future enhancement)
- ⏳ Social features (future enhancement)

## 🎓 Learning Resources

This project demonstrates several modern React Native concepts:

- **Expo Development**: Modern React Native development workflow
- **TypeScript**: Type-safe mobile app development
- **State Management**: Zustand for global state, React-Query for server state
- **Backend Integration**: Supabase as a Backend-as-a-Service
- **Authentication**: JWT-based auth with session persistence
- **Data Fetching**: React-Query patterns and caching strategies
- **Navigation**: React Navigation with conditional routing
- **Styling**: Tailwind CSS in React Native with NativeWind

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

Created as a demonstration of modern mobile app development practices.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing React Native framework
- **Supabase Team**: For the excellent Backend-as-a-Service platform
- **TanStack Team**: For React-Query (TanStack Query)
- **NativeWind Team**: For bringing Tailwind CSS to React Native
- **Sample Videos**: From Google Cloud Storage public samples

## 📞 Support

For questions, issues, or support:

- **Issues**: Open an issue on GitHub
- **Documentation**: Check the `docs/` folder
- **Expo Docs**: [docs.expo.dev](https://docs.expo.dev)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Navigation Docs**: [reactnavigation.org](https://reactnavigation.org)

---

**Built with ❤️ using Expo, TypeScript, React-Query, Supabase, and NativeWind**
