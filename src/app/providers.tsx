import { QueryClient, QueryClientProvider, type DehydrateOptions } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { ReactNode } from 'react';
import { githubQueryKeys } from '@/shared/api/github/queryKeys';
import { queryPersister } from '@/shared/storage/queryPersister';

const defaultQueryOptions = {
  staleTime: 60_000,
  gcTime: 1000 * 60 * 60 * 24,
  retry: (failureCount: number, error: unknown) => {
    if (typeof error === 'object' && error !== null && 'kind' in error && error.kind === 'rate_limit') {
      return false;
    }
    return failureCount < 2;
  },
};

const defaultOptions = {
  queries: defaultQueryOptions,
};

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions,
  });
}

const queryClient = createQueryClient();

type AppProvidersProps = {
  children: ReactNode;
  client?: QueryClient;
  persist?: boolean;
};

const persistDehydrateOptions: DehydrateOptions = {
  shouldDehydrateQuery: (query) => query.queryKey[0] === githubQueryKeys.all[0] && query.state.status === 'success',
};

const persistOptions = {
  persister: queryPersister,
  maxAge: 1000 * 60 * 60 * 24,
  dehydrateOptions: persistDehydrateOptions,
};

export function AppProviders({ children, client = queryClient, persist = true }: AppProvidersProps) {
  if (!persist) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return (
    <PersistQueryClientProvider client={client} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
}
