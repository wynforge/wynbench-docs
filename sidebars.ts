import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/install',
        'getting-started/run-agent',
        'getting-started/run-ui',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'architecture/agent',
        'architecture/ui',
        'architecture/plugins',
      ],
    },
    'connections',
    'actions-and-workflows',
    'plugin-development',
  ],
};

export default sidebars;
