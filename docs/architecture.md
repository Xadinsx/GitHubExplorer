# Architecture

Feature folders, a typed GitHub API boundary, and TanStack Query as the use-case layer. There are no ports, repositories, or DI containers — two screens do not need them.

Copy an existing slice (`search`, `repo-detail`) instead of inventing a new layout.

## Layers

```
src/
  app/              # shell: App, providers, error boundary
  navigation/       # typed native stack only
  features/         # product slices: screens, feature UI, query hooks
  shared/           # reused by more than one feature
    api/github/     # HTTP, DTOs, mappers, query keys, errors
    types/          # domain types the UI may import
    storage/        # MMKV and query persistence
    ui/             # presentational widgets used across features
    theme/          # Unistyles + tokens
    i18n/           # locale catalogs + init
    config/         # env, page size, debounce
  types/            # ambient TS only (e.g. env.d.ts) — not domain models
```

| Layer                | Owns                                                                    | Must not                                                |
| -------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------- |
| `app/`               | QueryClient, theme/i18n bootstrap, ErrorBoundary                        | GitHub URLs, screen UI                                  |
| `navigation/`        | Stack, param list, header chrome                                        | Fetching, feature business rules                        |
| `features/<name>/`   | Screens, feature-only components, `useQuery` / `useInfiniteQuery` hooks | Raw `fetch`, snake_case DTOs, other features’ internals |
| `shared/api/github/` | `githubRequest`, endpoints, DTO types, mappers, `githubQueryKeys`       | React, Unistyles, navigation                            |
| `shared/types/`      | CamelCase domain models (`Repository`, `SearchPage`)                    | GitHub JSON field names                                 |
| `shared/ui/`         | Dumb widgets (`EmptyState`, `ErrorView`, `SkeletonList`)                | Feature-specific copy wiring beyond generic props       |

**Data flow (one direction):**

```
Screen → feature hook (TanStack Query) → getX / searchX → githubRequest → DTO → mapper → domain type → Screen
```

Screens never call `fetch`. Screens never import `*Dto` types. Query keys live only in `queryKeys.ts`.

Walkthrough of this stack on repo detail: [`docs/live-repo-detail.md`](./live-repo-detail.md).

## Dependency rules

1. Features import `@/shared/…` and `@/navigation/types`. They do not import another feature.
2. `shared/` does not import `features/` or `navigation/`.
3. `shared/api/github/` does not import React Native UI.
4. Cross-file imports use the `@/` alias (`@/features/search/screens/SearchScreen`). Relative imports are only for a file’s own folder (`./SearchScreen.styles`, `../hooks/useRepoSearch`).
5. Do not add barrel `index.ts` files. The one exception is `shared/i18n/index.ts` (i18next init). Import the concrete file.

## File and folder naming

These rules are mandatory for new files.

### Folders

- **kebab-case**: `repo-detail`, `api/github`.
- Never PascalCase, snake_case, or unprefixed dump folders (`utils/`, `helpers/`, `misc/`).
- Create a folder only when it will contain a file in the same change. No empty `components/` or `hooks/`.

### Feature slice

```
src/features/<kebab-name>/
  screens/          # *Screen.tsx — one route, one file
  components/       # feature-only UI (not a full screen)
  hooks/            # TanStack Query (or tiny UI hooks) for this feature
```

Omit a subfolder if the feature has nothing to put there.

### Files

| Kind               | Pattern                                             | Examples                                                        |
| ------------------ | --------------------------------------------------- | --------------------------------------------------------------- |
| Screen             | `PascalCase` + `Screen` suffix                      | `SearchScreen.tsx`, `RepoDetailScreen.tsx`                      |
| React component    | `PascalCase`                                        | `RepoRow.tsx`, `EmptyState.tsx`, `ErrorBoundary.tsx`            |
| Unistyles          | sibling `<SameName>.styles.ts`                      | `RepoRow.styles.ts`                                             |
| Hook               | `use` + `PascalCase` remainder                      | `useRepoSearch.ts`, `useRepoDetail.ts`                          |
| API endpoint       | camelCase verb + resource                           | `getRepo.ts`, `searchRepos.ts`                                  |
| Module (non-UI)    | camelCase                                           | `queryKeys.ts`, `mappers.ts`, `client.ts`, `themePreference.ts` |
| Domain type module | kebab or noun matching the type                     | `repository.ts`                                                 |
| Ambient types      | stay under `src/types/`                             | `env.d.ts`                                                      |
| Test               | same basename + `.test.ts` / `.test.tsx`, colocated | `getRepo.test.ts`, `SearchScreen.test.tsx`                      |

Do not invent other suffixes (`.view.tsx`, `.container.tsx`, `.service.ts`, `.repository.ts`).

### API files (`shared/api/github/`)

- **One GitHub endpoint per file.** `getRepo.ts` is `GET /repos/{owner}/{repo}`. Do not fold a new endpoint into `client.ts`.
- DTOs stay in `dto.ts` and are named `Github*Dto`.
- Mapping stays in `mappers.ts`. New fields extend the existing mappers; do not create `mapFoo.ts` unless `mappers.ts` is no longer one concern.
- Errors stay in `errors.ts`. Query key factory stays in `queryKeys.ts`.

### Styles

- Every visual component has a sibling `*.styles.ts`.
- No inline `style={{ }}` and no `StyleSheet.create` inside TSX.
- Do not share a styles file across unrelated components.

### Tests

- Colocate next to the unit under test. No `__tests__/` trees.
- No snapshots.
- Use real `i18n.t('…')` keys; do not mock i18next.

## Where a new file goes

| You are adding…                               | Put it in                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| A new screen / route                          | `src/features/<kebab>/screens/<Name>Screen.tsx` + register in `navigation/` |
| A row, badge, or block used on one screen     | that feature’s `components/`                                                |
| Empty / error / skeleton used on two features | `src/shared/ui/`                                                            |
| `useQuery` / `useInfiniteQuery` for a screen  | that feature’s `hooks/`                                                     |
| A GitHub HTTP call                            | `src/shared/api/github/<verbNoun>.ts` + DTO/mapper/query key as needed      |
| A type the UI should see                      | `src/shared/types/` (camelCase fields, mapped from DTOs)                    |
| Theme tokens                                  | `src/shared/theme/`                                                         |
| Copy                                          | `src/shared/i18n/en.ts` and `pt.ts`                                         |

If the file is only needed by one feature, it is not `shared/`.
