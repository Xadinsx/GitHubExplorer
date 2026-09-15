export const lightTheme = {
  colors: {
    background: '#F4F6F8',
    surface: '#FFFFFF',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    accent: '#0969DA',
    star: '#9A6700',
    danger: '#B42318',
    banner: '#FFF4E5',
    onBanner: '#93370D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radius: {
    sm: 8,
    md: 12,
  },
} as const;

export const darkTheme = {
  colors: {
    background: '#0D1117',
    surface: '#161B22',
    text: '#E6EDF3',
    textMuted: '#8B949E',
    border: '#30363D',
    accent: '#58A6FF',
    star: '#D29922',
    danger: '#F85149',
    banner: '#3D2F00',
    onBanner: '#E3B341',
  },
  spacing: lightTheme.spacing,
  radius: lightTheme.radius,
} as const;

export type AppTheme = typeof lightTheme;
