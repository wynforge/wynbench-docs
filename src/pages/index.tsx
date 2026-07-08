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
    title: 'Backend-Agent-Driven Automation',
    icon: 'smart_toy',
    description: (
      <>
        The Wynbench agent orchestrates workflows, manages connections to
        external systems, and executes actions — all without manual intervention.
      </>
    ),
  },
  {
    title: 'Extensible Plugin System',
    icon: 'extension',
    description: (
      <>
        Protocol modules snap into the agent at runtime. Build plugins for any
        messaging system, API, or legacy transport with a simple interface.
      </>
    ),
  },
  {
    title: 'Visual Workflow Designer',
    icon: 'dashboard',
    description: (
      <>
        The Wynbench UI provides a drag-and-drop canvas for designing and
        monitoring workflows, with real-time status feedback.
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={clsx(styles.featureIcon, styles.materialSymbol)} aria-hidden="true">{icon}</div>
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
              {features.map((props) => (
                <Feature key={props.title} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
