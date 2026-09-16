# What changed: live repo detail (explained simply)

This is a walkthrough of a set of small cleanups plus one real product change: **the repository screen now loads from GitHub**, instead of showing a copy of the search row you tapped.

If you are new to React Native, read this top to bottom. Words in `code` are file or function names you can search for in the project.

---

## The big idea in one picture

**Before:** Search already had the repo. Tapping a row stuffed that whole object into navigation and the detail screen just displayed it. Fast, but it was a photocopy of search — not a fresh lookup. GitHub’s search API also lies a bit about “watchers” (more on that below).

**After:** Search only passes two strings: who owns the repo, and the repo name. Detail calls GitHub again: `GET /repos/{owner}/{repo}`. While that runs you see a skeleton. If it fails, you see an error with Retry.

```
Search list
    │
    │  tap row  →  { owner: "facebook", repo: "react-native" }
    ▼
Detail screen
    │
    │  useRepoDetail(owner, repo)
    ▼
getRepo  →  githubRequest  →  api.github.com/repos/facebook/react-native
    │
    ▼
mapRepoDetail  →  our Repository type  →  the UI
```

Same pattern as search: **wire JSON in, our own types out, screen never sees snake_case.**

---

## 1. Navigation: pass an address, not a suitcase

### Dummy version

Imagine you tell a friend “go look at facebook/react-native on GitHub” versus handing them a printout of the repo from last week. The printout is convenient. It is also stale, and you cannot bookmark “just the name.”

We used to pass the printout (`repository` plus an unused `repositoryId`). Now we pass the address.

### In the code

[`src/navigation/types.ts`](../src/navigation/types.ts) is the contract for every screen:

```ts
RepoDetail: {
  owner: string;
  repo: string;
}
```

[`SearchScreen.tsx`](../src/features/search/screens/SearchScreen.tsx) navigates like this:

```ts
navigation.navigate('RepoDetail', {
  owner: repository.owner.login,
  repo: repository.name,
});
```

[`RootStack.tsx`](../src/navigation/RootStack.tsx) sets the header title from those params (`facebook/react-native`) **immediately**, even before the network returns. The title does not need the fetch.

---

## 2. Why fetch at all? Watchers vs subscribers

GitHub has two similar numbers:

| Field                                 | What it actually is                       |
| ------------------------------------- | ----------------------------------------- |
| `stargazers_count`                    | Stars (the number people care about)      |
| `watchers_count` on **search**        | Often the same as stars. Historical mess. |
| `subscribers_count` on **GET /repos** | People actually **watching** the repo     |

Search results do not include `subscribers_count`. So if detail only reused the search row, “Watchers” on the detail screen was not really watchers.

[`mapRepository`](../src/shared/api/github/mappers.ts) (search) still maps `watchers_count` → `watchers`.

[`mapRepoDetail`](../src/shared/api/github/mappers.ts) reuses that mapping, then **overwrites** watchers with `subscribers_count`.

[`GithubRepoDetailDto`](../src/shared/api/github/dto.ts) is “search repo JSON **plus** `subscribers_count`.” Search items stay on the smaller type so we do not pretend a field exists when GitHub did not send it.

---

## 3. The fetch stack (copy search, don’t invent a new architecture)

Think of each file as one job. If you can say the job in one sentence, the file is doing it right.

| File                                                                               | One-sentence job                                               |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`getRepo.ts`](../src/shared/api/github/getRepo.ts)                                | Hit `/repos/{owner}/{repo}` and return our `Repository`.       |
| [`githubRequest` in `client.ts`](../src/shared/api/github/client.ts)               | Shared GET helper: headers, token, rate limit, network errors. |
| [`queryKeys.ts`](../src/shared/api/github/queryKeys.ts)                            | Cache identity: `['repos', 'detail', owner, repo]`.            |
| [`useRepoDetail.ts`](../src/features/repo-detail/hooks/useRepoDetail.ts)           | “Load this owner/repo with TanStack Query.”                    |
| [`RepoDetailScreen.tsx`](../src/features/repo-detail/screens/RepoDetailScreen.tsx) | Pending → skeleton, error → retry, success → the page.         |

### `getRepo` in dummy terms

1. `encodeURIComponent` so weird names in the URL do not break the path (`owner/repo` with spaces, unicode, etc.).
2. Call the shared client with path `/repos/facebook/react-native`.
3. Run `mapRepoDetail` so the rest of the app never sees `avatar_url` or `subscribers_count`.

### `useRepoDetail` in dummy terms

TanStack Query is a smart cache for server data.

- **queryKey** = the cache slot. `facebook` + `react-native` is a different slot from `facebook` + `react`.
- **queryFn** = how to fill the slot (`getRepo`).
- **enabled** = do not fire if owner or repo is empty (defensive; navigation should always pass both).
- **signal** = if you leave the screen, abort the in-flight request.

The screen does not call `fetch`. It reads `detail.data`, `detail.isPending`, `detail.isError`, `detail.refetch()`.

Successful detail queries are persisted the same way as search (keys that start with `'repos'`). Open the repo again after a restart and you may see cached data instantly, then a refresh according to `staleTime` (60 seconds).

### The screen’s three states

```
isPending?  →  SkeletonList (gray placeholder rows — reuse, no extra component)
isError?    →  ErrorView (rate limit / offline / generic) + Retry = refetch()
else        →  the real UI (stars, license, Open on GitHub, …)
```

`isPending` means “we do not have data yet.” After a failure, Retry calls `refetch()`; you stay on the error UI until a new result arrives.

---

## 4. ErrorBoundary: Reload that actually reloads

### Dummy version

An **error boundary** is a safety net around the app. If a child **throws while rendering**, React shows a fallback instead of a white screen.

The old Reload button only set `hasError` back to `false` and rendered the **same** tree again. If the crash was in render, that tree throws immediately. The button looked like it worked; it often did not.

### The fix

We keep a counter called `resetKey`. Reload does two things:

1. `hasError: false` — hide the fallback.
2. `resetKey + 1` — change the React `key` on the children.

Changing `key` tells React: **throw this subtree away and mount a fresh one.** That is a real remount.

Code: [`src/app/ErrorBoundary.tsx`](../src/app/ErrorBoundary.tsx).

This still does **not** catch errors in event handlers, `fetch`, or native crashes. Those are different kinds of failure. Network errors on detail go through `ErrorView`, not this boundary.

---

## 5. Tiny cleanups

### Rate-limit retries

GitHub returns a special 403 when you are out of quota. We already turn that into `GithubApiError` with `kind: 'rate_limit'`.

Retrying that error would just burn more quota. [`providers.tsx`](../src/app/providers.tsx) now asks `isGithubApiError(error)` instead of poking at `error.kind` like a mystery bag. Same behavior, honest type check.

### Unused template package

React Native’s init template ships `@react-native/new-app-screen`. This app never imported it, so it was removed from `package.json`.

### `test-renderer` stayed

The plan guessed it was leftover next to `react-test-renderer`. It is not: `@testing-library/react-native` v14 `require`s the `test-renderer` package (`createRoot`). Removing it breaks every `render()` test. So it stays.

---

## 6. Tests (what they prove)

| Test                                                                                         | What a dummy should take away                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`getRepo.test.ts`](../src/shared/api/github/getRepo.test.ts)                                | We really call `/repos/...` and map `subscribers_count` to `watchers`.                           |
| [`mappers.test.ts`](../src/shared/api/github/mappers.test.ts)                                | Search mapping vs detail mapping are both explicit.                                              |
| [`SearchScreen.test.tsx`](../src/features/search/screens/SearchScreen.test.tsx)              | Tapping a row navigates with `{ owner, repo }`, not the whole object.                            |
| [`RepoDetailScreen.test.tsx`](../src/features/repo-detail/screens/RepoDetailScreen.test.tsx) | Success shows the page and opens GitHub; failure shows the network copy and Retry fetches again. |

Screen tests wrap in `AppProviders` with `persist={false}` so we do not touch MMKV. They mock `getRepo` / `searchRepos` — they test the UI wiring, not GitHub.

Tests use real `i18n.t('…')` strings (the English keys’ values), not mocked translation hooks.

---

## 7. Maestro (the robot that taps the app)

[`.maestro/search-detail-theme.yaml`](.maestro/search-detail-theme.yaml) is an on-device script: type a search, tap a row, wait for detail.

**Before**, detail was instant (no network), so `assertVisible: 'Open on GitHub'` was fine.

**Now** there is a request, so we `extendedWaitUntil` for that button (15s), same as we already wait for search results. Otherwise the robot taps Dark while the skeleton is still on screen.

---

## File checklist

New:

- `src/shared/api/github/getRepo.ts`
- `src/shared/api/github/getRepo.test.ts`
- `src/features/repo-detail/hooks/useRepoDetail.ts`

Touched in a meaningful way:

- `src/navigation/types.ts` — params
- `src/features/search/screens/SearchScreen.tsx` — navigate
- `src/navigation/RootStack.tsx` — header title
- `src/shared/api/github/dto.ts` — detail DTO
- `src/shared/api/github/mappers.ts` — `mapRepoDetail`
- `src/shared/api/github/queryKeys.ts` — `detail(owner, repo)`
- `src/features/repo-detail/screens/RepoDetailScreen.tsx` — fetch + states
- `src/app/ErrorBoundary.tsx` — remount
- `src/app/providers.tsx` — `isGithubApiError`
- `.maestro/search-detail-theme.yaml`
- `README.md` — removed “fetch GET /repos later” from the more-time list

Intentionally **not** done: splitting `SearchScreen` into more files. A list screen that owns debounce, empty, error, and paging is normal React Native.

---

## How to try it

1. `yarn start` and run the app.
2. Search something (`react-native`).
3. Tap a row. Header should show `owner/repo` at once; body should skeleton then fill.
4. Turn on airplane mode and open a repo you have **not** cached — you should get the offline error and Retry.

`yarn test SearchScreen RepoDetailScreen mappers getRepo` and `yarn tsc` cover the automated side.
