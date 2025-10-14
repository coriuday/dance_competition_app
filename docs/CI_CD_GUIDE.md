# CI/CD Guide

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the Dance Competition App.

## Overview

The project uses GitHub Actions for automated testing, linting, and building. The workflow is defined in `.github/workflows/build-test.yml`.

## Workflow Triggers

The CI/CD pipeline runs on:
- **Push** to `main` or `develop` branches
- **Pull requests** targeting `main` or `develop` branches

## Pipeline Stages

### 1. Lint and Type Check

**Purpose**: Ensure code quality and type safety

**Steps**:
- Checkout code
- Install dependencies
- Run ESLint for code linting
- Run TypeScript compiler for type checking

**Commands** (run locally):
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix auto-fixable issues
npm run type-check    # Run TypeScript type check
```

### 2. Test

**Purpose**: Run unit and integration tests

**Steps**:
- Checkout code
- Install dependencies
- Run Jest tests with coverage
- Upload coverage reports as artifacts

**Commands** (run locally):
```bash
npm test              # Run tests with coverage
npm run test:watch    # Run tests in watch mode
```

**Coverage Requirements**:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

### 3. Build

**Purpose**: Build the app using EAS Build

**Conditions**:
- Only runs on push (not pull requests)
- Only runs on `main` or `develop` branches
- Requires lint and test jobs to pass

**Build Profiles**:
- `main` branch → Production build
- `develop` branch → Preview build

## Local Development

### Running Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

## GitHub Actions Setup

### Required Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

1. **EXPO_TOKEN**
   - Description: Expo access token for EAS CLI
   - How to get: https://expo.dev/accounts/[username]/settings/access-tokens
   - Required for: Building with EAS

2. **EXPO_PUBLIC_SUPABASE_URL**
   - Description: Your Supabase project URL
   - Example: `https://xxxxx.supabase.co`
   - Required for: Building with environment variables

3. **EXPO_PUBLIC_SUPABASE_ANON_KEY**
   - Description: Your Supabase anonymous/public key
   - Required for: Building with environment variables

### Workflow Configuration

The workflow file is located at `.github/workflows/build-test.yml`.

Key features:
- Uses Node.js 20
- Caches npm dependencies for faster builds
- Runs jobs in parallel where possible
- Uploads test coverage as artifacts
- Conditional EAS builds based on branch

## Troubleshooting

### Lint Job Fails

**Issue**: ESLint errors in code

**Solution**:
```bash
# Run locally to see errors
npm run lint

# Auto-fix issues
npm run lint:fix

# Manually fix remaining issues
```

### Test Job Fails

**Issue**: Tests are failing or coverage is below threshold

**Solution**:
```bash
# Run tests locally
npm test

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests in watch mode for debugging
npm run test:watch
```

### Type Check Fails

**Issue**: TypeScript compilation errors

**Solution**:
```bash
# Run type check locally
npm run type-check

# Fix type errors in your code
# Common issues:
# - Missing type definitions
# - Incorrect prop types
# - Missing return types
```

### Build Job Fails

**Issue**: EAS build fails

**Common causes**:
1. Missing or incorrect secrets
2. Invalid eas.json configuration
3. Expo account issues
4. Build timeout

**Solution**:
1. Verify all secrets are set correctly
2. Check EAS build logs in Expo dashboard
3. Test build locally: `eas build --profile preview --platform android --local`
4. Ensure Expo account has sufficient build credits

### Dependencies Installation Fails

**Issue**: npm ci fails

**Solution**:
```bash
# Delete package-lock.json and node_modules
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Commit updated package-lock.json
git add package-lock.json
git commit -m "fix: update package-lock.json"
```

## Best Practices

### Before Pushing Code

1. **Run linting**:
   ```bash
   npm run lint:fix
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Check types**:
   ```bash
   npm run type-check
   ```

4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   git commit -m "docs: update documentation"
   ```

### Pull Request Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create pull request
4. Wait for CI checks to pass
5. Request code review
6. Merge after approval and passing checks

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `fix/*`: Bug fix branches

## Monitoring

### GitHub Actions Dashboard

View workflow runs:
1. Go to your repository on GitHub
2. Click "Actions" tab
3. View recent workflow runs and their status

### Expo Dashboard

View EAS builds:
1. Go to [expo.dev](https://expo.dev)
2. Navigate to your project
3. Click "Builds" to see build history and logs

## Performance Optimization

### Caching

The workflow uses npm caching to speed up dependency installation:
```yaml
cache: 'npm'
cache-dependency-path: dance-competition-app/package-lock.json
```

### Parallel Jobs

Lint and test jobs run in parallel to reduce total pipeline time.

### Conditional Builds

Builds only run on push to main/develop branches, not on every pull request, to save build credits.

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [EAS Build CI Documentation](https://docs.expo.dev/build/building-on-ci/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Documentation](https://eslint.org/docs/latest/)
