import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Wynbench',
  tagline: 'Intelligent workflow automation — agent, UI, and plugins.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://wynforge.github.io',
  baseUrl: '/wynbench-docs/',

  organizationName: 'wynforge',
  projectName: 'wynbench-docs',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wynforge/wynbench-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Wynbench',
      logo: {
        alt: 'Wynbench Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/wynforge/wynbench-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Overview', to: '/docs/overview' },
            { label: 'Getting Started', to: '/docs/getting-started/install' },
            { label: 'Architecture', to: '/docs/architecture/agent' },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wynforge/wynbench-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Wynbench.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'csharp', 'powershell'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
