# [John Lian](https://jlian.co)

[![Netlify Status](https://api.netlify.com/api/v1/badges/a198ff69-8390-43dc-b6db-661a6abfe504/deploy-status)](https://app.netlify.com/sites/confident-wright-e9ea66/deploys)

New personal website built with Hugo. It's a replacement of my [old website](https://github.com/jlian/jlian.github.io) which was using Jekyll and Github Pages.

## Development

### GitHub Codespaces

This repository includes a Codespaces configuration that automatically sets up a complete Hugo development environment. Simply open the repository in Codespaces and everything will be ready to go, including Hugo 0.152.2 extended edition.

To start the Hugo development server:
```bash
hugo server
```

### Local Development

Build this with a `hugo` command. Tested with version 0.152.2.

## Dependency Updates

This repository uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to automatically keep dependencies up to date. Dependabot will create pull requests for:

- **GitHub Actions** - Updates to workflow actions (checked weekly)
- **Git Submodules** - Updates to the Hugo theme (checked weekly)
- **Dev Container Features** - Updates to Codespaces configuration (checked weekly)

Configure Dependabot in `.github/dependabot.yml`.
