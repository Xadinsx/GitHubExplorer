import type { Repository } from '@/shared/types/repository';

export type RootStackParamList = {
  Search: undefined;
  RepoDetail: {
    repositoryId: number;
    repository: Repository;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
