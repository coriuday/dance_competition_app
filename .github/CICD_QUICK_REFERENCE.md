# CI/CD Quick Reference

## 🚀 Quick Commands

### Local Development
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check
```

### EAS Build
```bash
# Login to Expo
eas login

# Build for development
eas build --profile development --platform all

# Build for preview
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all

# Build locally (faster, no cloud)
eas build --profile development --platform android --local

# List builds
eas build:list

# View build details
eas build:view [build-id]
```

### Environment Variables
```bash
# Create secret
eas secret:create --scope project --name VAR_NAME --value "value"

# List secrets
eas secret:list

# Delete secret
eas secret:delete --name VAR_NAME
```

## 📋 GitHub Secrets Required

| Secret Name | Description | Where to Get |
|------------|-------------|--------------|
| `EXPO_TOKEN` | Expo access token | https://expo.dev/accounts/[username]/settings/access-tokens |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → Settings → API |

## 🔄 Workflow Triggers

- **Push to main** → Lint + Test + Production Build
- **Push to develop** → Lint + Test + Preview Build
- **Pull Request** → Lint + Test only

## ✅ Pre-Push Checklist

```bash
# 1. Lint
npm run lint:fix

# 2. Type check
npm run type-check

# 3. Test
npm test

# 4. If all pass, commit and push
git add .
git commit -m "feat: your message"
git push
```

## 📊 Monitoring

- **GitHub Actions**: Repository → Actions tab
- **EAS Builds**: https://expo.dev → Your Project → Builds
- **Coverage Reports**: GitHub Actions → Workflow Run → Artifacts

## 🆘 Troubleshooting

### Lint fails
```bash
npm run lint:fix  # Auto-fix issues
```

### Tests fail
```bash
npm run test:watch  # Debug in watch mode
```

### Build fails
```bash
# Check secrets are set
eas secret:list

# Try local build
eas build --profile development --platform android --local
```

## 📚 Documentation

- Full CI/CD Guide: `docs/CI_CD_GUIDE.md`
- EAS Build Setup: `docs/EAS_BUILD_SETUP.md`
- Task Summary: `docs/TASK_12_SUMMARY.md`
