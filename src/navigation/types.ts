export type RootStackParamList = {
  Search: undefined;
  RepoDetail: {
    owner: string;
    repo: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
