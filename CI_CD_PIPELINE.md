# CI/CD Pipeline Documentation for Nexa UI

## Overview
This document describes the CI/CD pipelines set up for the Nexa UI component library using GitHub Actions. The pipelines automate testing, type checking, and deployment processes to ensure code quality and streamline the release workflow.

## Pipelines

### 1. Main Branch CI (`main.yml`)
**Trigger**: Pushes to the `main` branch.

**Purpose**: Ensures that all code merged into the main branch passes the test suite and type checking.

**Steps**:
1. **Checkout code**: Retrieves the latest code from the repository.
2. **Setup Node.js**: Configures Node.js environment (version 20).
3. **Install dependencies**: Installs project dependencies using `npm ci`.
4. **Type check**: Runs TypeScript type checking using `vue-tsc`.
5. **Run tests**: Executes the entire Vitest test suite with coverage reporting.

### 2. Pull Request CI (`pr.yml`)
**Trigger**: Creation or update of pull requests targeting the `main` branch.

**Purpose**: Validates code changes before they are merged, providing feedback to developers.

**Steps**:
1. **Checkout code**: Retrieves the code from the PR branch.
2. **Setup Node.js**: Configures Node.js environment (version 20).
3. **Install dependencies**: Installs project dependencies.
4. **Type check**: Validates TypeScript types.
5. **Run tests**: Executes test suite with coverage.
6. **Upload coverage report**: Stores the coverage report as an artifact.
7. **PR comment**: Attempts to add a coverage summary as a comment on the PR.

### 3. Release Pipeline (`release.yml`)
**Trigger**: Pushing a tag matching the `v*.*.*` pattern (e.g., `v1.0.0`).

**Purpose**: Automates the release process, including library publishing and documentation deployment.

**Steps**:
1. **Build and Publish to npm**:
   - Checkout code and set up Node.js
   - Install dependencies and run tests
   - Build the library using `build:lib` script
   - Publish the package to npm registry

2. **Deploy Docs to GitHub Pages**:
   - Runs after successful npm publication
   - Builds VitePress documentation
   - Deploys the generated documentation to GitHub Pages

## Configuration and Secrets

### Required Secrets
To fully utilize these pipelines, the following secrets must be configured in the repository settings:

1. **NPM_TOKEN**: Authentication token for publishing packages to npm.
   - Generate from npm website: Settings → Access Tokens → Generate New Token
   - Required for: `release.yml`

### Environment Variables
- `NODE_AUTH_TOKEN`: Automatically used by npm during publication (populated from `NPM_TOKEN` secret).
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions, used for GitHub Pages deployment.

## Triggering the Pipelines

### Main Branch CI
- Automatically runs on every push to the `main` branch.
- Ensures the main branch remains stable.

### Pull Request CI
- Runs automatically when a PR is opened or updated.
- Provides fast feedback to developers about the quality of their changes.
- Failing pipelines block merging (if branch protection rules are enabled).

### Release Pipeline
- Triggered by pushing a version tag.
- Example:
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

## Best Practices

1. **Branch Protection**: Enable branch protection rules for the `main` branch to:
   - Require pull request reviews before merging.
   - Require status checks to pass before merging.
   - Include the CI pipelines in required status checks.

2. **Versioning**: Follow Semantic Versioning (SemVer) for tag names:
   - `vMAJOR.MINOR.PATCH` (e.g., `v1.0.0`, `v1.1.0`, `v1.1.1`)

3. **Test Coverage**: Aim for high test coverage to ensure the library's reliability.
   - Coverage reports are generated automatically and can be downloaded from PR artifacts.

4. **Documentation**: Keep the VitePress documentation up-to-date as it's automatically deployed with each release.

## Troubleshooting

### Common Issues

1. **npm Publication Failures**:
   - Verify that the `NPM_TOKEN` secret is correctly set.
   - Ensure the package name is available on npm.
   - Check that the version number in `package.json` matches the tag.

2. **GitHub Pages Deployment**:
   - Ensure the repository has GitHub Pages enabled.
   - Verify that the `peaceiris/actions-gh-pages` action has the necessary permissions.

3. **Test Failures**:
   - Check the pipeline logs for specific error messages.
   - Ensure all tests pass locally before pushing.

## Maintenance

- Regularly update the Node.js version in the workflows to use LTS releases.
- Review and update workflow actions to their latest versions periodically.
- Monitor pipeline runs and address any recurring issues.
