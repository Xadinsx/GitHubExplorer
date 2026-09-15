export type GithubErrorKind = 'rate_limit' | 'http' | 'network';

/**
 * Typed GitHub failures so UI can tell a 403 quota miss from airplane mode.
 */
export class GithubApiError extends Error {
  readonly kind: GithubErrorKind;
  readonly status: number | null;

  constructor(kind: GithubErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = 'GithubApiError';
    this.kind = kind;
    this.status = status;
  }
}

export function isGithubApiError(error: unknown): error is GithubApiError {
  return error instanceof GithubApiError;
}
