import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: string;
};

const features: FeatureItem[] = [
  {
    title: 'Agent-Driven Automation',
    icon: '🤖',
    description: (
      <>
        The Wynbench agent orchestrates workflows, manages connections to
        external systems, and executes actions — all without manual intervention.
      </>
    ),
  },
  {
    title: 'Extensible Plugin System',
    icon: '🔌',
    description: (
      <>
        Protocol modules snap into the agent at runtime. Build plugins for any
        messaging system, API, or legacy transport with a simple interface.
      </>
    ),
  },
  {
    title: 'Visual Workflow Designer',
    icon: '🖥️',
    description: (
      <>
        The Wynbench UI provides a drag-and-drop canvas for designing and
        monitoring workflows, with real-time status feedback.
      </>
    ),
  },
  {
    title: 'MSMQ & Legacy Support',
    icon: '📨',
    description: (
      <>
        The MSMQ shim bridges modern workflow automation with classic Microsoft
        Message Queue infrastructure, no refactor required.
      </>
    ),
  },
  {
    title: 'One-Click Packaging',
    icon: '📦',
    description: (
      <>
        Bundle the agent, UI, and all selected plugins into a single deployable
        archive with the Wynbench packager.
      </>
    ),
  },
  {
    title: 'Dark & Light Mode',
    icon: '🌙',
    description: (
      <>
        Documentation adapts to your system preference. Switch between dark and
        light themes at any time using the navbar toggle.
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureIcon}>{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview">
            Get Started →
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/getting-started/install">
            Installation Guide
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Wynbench — intelligent workflow automation with an extensible agent, visual UI, and plugin ecosystem.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
