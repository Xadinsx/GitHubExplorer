# Contributing

## Branch names

Prefix, then kebab-case. Never `cursor/` and never an unprefixed name.

| Prefix      | Use for                                               |
| ----------- | ----------------------------------------------------- |
| `feature/`  | New behavior                                          |
| `refactor/` | Structure or clarity with no intended behavior change |
| `fix/`      | A bug that is not an urgent production break          |
| `hotfix/`   | Urgent production fix                                 |
| `chore/`    | Tooling, deps, CI, formatting                         |

Examples:

- `feature/search-language-filter`
- `refactor/extract-named-config-objects`
- `fix/offline-banner-not-showing`
- `hotfix/rate-limit-crash`
- `chore/pin-prettier-print-width`

Commits use conventional commits (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`).

## Layout and naming

New files follow [`docs/architecture.md`](docs/architecture.md): kebab-case folders, PascalCase screens/components, camelCase modules, colocated `*.styles.ts` and `*.test.ts(x)`. Do not add a file until that doc says which folder it belongs in.

## Pre-commit

`yarn install` enables Husky. Each commit runs lint-staged: ESLint (with Prettier) on staged `ts`/`tsx`, and Prettier on staged `json`/`md`/`mdc`/`yml`.
