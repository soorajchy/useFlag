# GitHub Actions Setup Guide

This repository uses GitHub Actions to automatically publish to npm when changes are pushed to the `master` branch.

## Setup Instructions

### 1. Create an npm Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Click on your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type (for CI/CD)
5. Copy the generated token (starts with `npm_...`)

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/soorajchy/useFlag
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### 3. Update package.json (if needed)

Make sure your `package.json` has:
- Correct package name: `@uikudo/useflag` (or update to your npm scope)
- `"private": false` or remove the private field
- Valid version number

### 4. How It Works

Once set up, the workflow will:
1. Trigger on every push to `master` branch
2. Install dependencies
3. Build the package
4. Publish to npm automatically

### 5. Version Management

**Important**: Before pushing to master, update the version in `package.json`:

```bash
# Patch release (0.1.0 → 0.1.1)
npm version patch

# Minor release (0.1.0 → 0.2.0)
npm version minor

# Major release (0.1.0 → 1.0.0)
npm version major
```

Then commit and push:
```bash
git add package.json
git commit -m "Bump version to x.x.x"
git push origin master
```

### 6. Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
pnpm build
pnpm publish
```

### Workflow File Location

- `.github/workflows/publish.yml`

### Troubleshooting

**Error: 403 Forbidden**
- Check that NPM_TOKEN secret is set correctly
- Verify your npm account has publish permissions
- Ensure the package name isn't already taken

**Error: Version already exists**
- Update the version in `package.json` before publishing
- npm doesn't allow republishing the same version

**Build Fails**
- Check that all dependencies are in `package.json`
- Verify the build script works locally: `pnpm build`
