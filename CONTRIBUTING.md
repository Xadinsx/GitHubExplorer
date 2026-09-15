# Contributing

## Branch names

Prefix, then kebab-case. Never `cursor/` and never an unprefixed name.

| Prefix | Use for |
| --- | --- |
| `feature/` | New behavior |
| `refactor/` | Structure or clarity with no intended behavior change |
| `fix/` | A bug that is not an urgent production break |
| `hotfix/` | Urgent production fix |
| `chore/` | Tooling, deps, CI, formatting |

Examples:

- `feature/search-language-filter`
- `refactor/extract-named-config-objects`
- `fix/offline-banner-not-showing`
- `hotfix/rate-limit-crash`
- `chore/pin-prettier-print-width`

Commits use conventional commits (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`).
