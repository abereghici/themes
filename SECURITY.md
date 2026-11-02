# Security policy

## Supported versions

Only `main` is supported. `install.sh` links your clone and downloads nothing itself (the VS Code step runs `npx @vscode/vsce` at the version `ports.yml` pins), so to take a fix, `git pull` and run `install.sh` again.

## Reporting a vulnerability

Report vulnerabilities privately through [GitHub's private vulnerability reporting](https://github.com/abereghici/themes/security/advisories/new), not in a public issue. `install.sh` runs commands on your machine, so a report about it is welcome.
