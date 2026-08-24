# Infrastructure Git Safety

## Purpose

Maintain safe Git ignore rules for local infrastructure and development files.

## Responsibilities

Create the root `.gitignore` if missing.

If it exists, merge missing infrastructure safety rules without replacing valid user-defined rules.

Protect where appropriate:

- `.env`
- `.env.*`
- secrets
- credentials
- private keys
- SSH keys
- private certificates
- `node_modules/`
- Python virtual environments
- Python caches
- test and coverage output
- logs
- temporary files
- local runtime data
- IDE-local files
- OS-generated files

Keep `.env.example` trackable.

## Safety

Never:

- read secret contents
- print secret contents
- delete detected sensitive files
- automatically untrack Git files
- use broad patterns that hide source code or documentation

If a potentially sensitive file is already tracked, report its path only.

## Output

Report:

- rules added
- rules preserved
- potentially sensitive paths found
- tracked sensitive paths requiring manual action