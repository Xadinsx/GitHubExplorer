const en = {
  appName: 'GitHub Explorer',
  search: {
    placeholder: 'Search repositories',
    idleTitle: 'Search GitHub',
    idleBody:
      'Try “react-native”, “unistyles”, or any keyword. Results include name, stars, language, and last update.',
    emptyTitle: 'No repositories found',
    emptyBody: 'Try a different keyword. GitHub search matches names, descriptions, and READMEs.',
    loading: 'Searching GitHub…',
    endOfList: 'That’s everything for this search.',
  },
  detail: {
    title: 'Repository',
    stars: 'Stars',
    forks: 'Forks',
    watchers: 'Watchers',
    issues: 'Open issues',
    language: 'Language',
    license: 'License',
    updated: 'Updated',
    created: 'Created',
    owner: 'Owner',
    openOnGithub: 'Open on GitHub',
    noDescription: 'No description provided.',
  },
  errors: {
    genericTitle: 'Something went wrong',
    genericBody: 'Please try again.',
    retry: 'Try again',
    networkTitle: 'You’re offline',
    networkBody: 'Connect to the internet and retry. Cached results stay available when you have them.',
    rateLimitTitle: 'GitHub rate limit hit',
    rateLimitBody:
      'Unauthenticated search is limited to 60 requests per hour. Add a GITHUB_TOKEN in .env (see .env.example) and restart Metro.',
    crashTitle: 'The app hit an unexpected error',
    crashRetry: 'Reload',
  },
  offline: {
    banner: 'Showing cached results. Pull to refresh when you’re back online.',
  },
  theme: {
    label: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  a11y: {
    repoAvatar: 'Repository owner avatar',
    stars: 'Star count',
    themeControl: 'Color theme',
  },
} as const;

export default en;
