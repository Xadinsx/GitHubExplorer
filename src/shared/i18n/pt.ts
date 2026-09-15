const pt = {
  appName: 'Explorador GitHub',
  search: {
    placeholder: 'Pesquisar repositórios',
    idleTitle: 'Pesquisar no GitHub',
    idleBody:
      'Experimenta “react-native”, “unistyles” ou qualquer palavra-chave. Os resultados incluem nome, estrelas, linguagem e última atualização.',
    emptyTitle: 'Nenhum repositório encontrado',
    emptyBody: 'Tenta outra palavra-chave. A pesquisa do GitHub cobre nomes, descrições e READMEs.',
    loading: 'A pesquisar no GitHub…',
    endOfList: 'Isto é tudo para esta pesquisa.',
  },
  detail: {
    title: 'Repositório',
    stars: 'Estrelas',
    forks: 'Forks',
    watchers: 'Watchers',
    issues: 'Issues abertas',
    language: 'Linguagem',
    license: 'Licença',
    updated: 'Atualizado',
    created: 'Criado',
    owner: 'Dono',
    openOnGithub: 'Abrir no GitHub',
    noDescription: 'Sem descrição.',
  },
  errors: {
    genericTitle: 'Algo correu mal',
    genericBody: 'Tenta outra vez.',
    retry: 'Tentar novamente',
    networkTitle: 'Estás offline',
    networkBody: 'Liga-te à internet e tenta outra vez. Resultados em cache ficam disponíveis.',
    rateLimitTitle: 'Limite de pedidos do GitHub',
    rateLimitBody:
      'Sem autenticação o GitHub limita a 60 pedidos por hora. Adiciona um GITHUB_TOKEN no .env (vê .env.example) e reinicia o Metro.',
    crashTitle: 'A app encontrou um erro inesperado',
    crashRetry: 'Recarregar',
  },
  offline: {
    banner: 'A mostrar resultados em cache. Puxa para atualizar quando voltares a estar online.',
  },
  theme: {
    label: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Escuro',
  },
  a11y: {
    repoAvatar: 'Avatar do dono do repositório',
    stars: 'Número de estrelas',
    themeControl: 'Tema de cores',
  },
} as const;

export default pt;
