import { EmptyState } from './EmptyState';
import { isGithubApiError } from '@/shared/api/github/errors';
import { useTranslation } from 'react-i18next';

type ErrorViewProps = {
  error: unknown;
  onRetry: () => void;
};

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  const { t } = useTranslation();

  if (isGithubApiError(error) && error.kind === 'rate_limit') {
    return (
      <EmptyState
        title={t('errors.rateLimitTitle')}
        body={t('errors.rateLimitBody')}
        actionLabel={t('errors.retry')}
        onAction={onRetry}
      />
    );
  }

  if (isGithubApiError(error) && error.kind === 'network') {
    return (
      <EmptyState
        title={t('errors.networkTitle')}
        body={t('errors.networkBody')}
        actionLabel={t('errors.retry')}
        onAction={onRetry}
      />
    );
  }

  return (
    <EmptyState
      title={t('errors.genericTitle')}
      body={t('errors.genericBody')}
      actionLabel={t('errors.retry')}
      onAction={onRetry}
    />
  );
}
