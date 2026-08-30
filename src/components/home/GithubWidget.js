import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import TerminalWindow from '@components/shared/TerminalWindow';
import styles from '@styles/component/GithubWidget.module.css';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

async function getLanguages(languagesUrl) {
    try {
        const response = await fetch(languagesUrl, { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } });

        if (!response.ok) {
            return [];
        }

        const languageBytes = await response.json();
        const totalBytes = Object.values(languageBytes).reduce((total, bytes) => total + bytes, 0);

        if (!totalBytes) {
            return [];
        }

        return Object.entries(languageBytes).sort(([ , a ], [ , b ]) => b - a).map(([ name, bytes ]) => ({ name, percent: Math.round((bytes / totalBytes) * 100) }));
    }
    catch {
        return [];
    }
}

async function getRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=5`, { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } });

        if (!response.ok) {
            return [];
        }

        const repositories = await response.json();

        return Promise.all(repositories.map(async (repository) => ({ ...repository, languages: await getLanguages(repository.languages_url) })));
    }
    catch {
        return [];
    }
}

export default async function GithubWidget() {
    const repositories = await getRepositories();

    if (!repositories.length) {
        return null;
    }

    return (
        <TerminalWindow title='rafi@codes: ~/github' className={styles.terminal}>
            <div className={styles.body}>
                <p className={styles.heading}><span className='prompt-symbol'>$</span> gh repo list --limit 5</p>
                <ul className={styles.list}>
                    {repositories.map((repository) => (
                        <li key={repository.id}>
                            <Link href={repository.html_url} target='_blank' rel='noopener noreferrer' className={styles.repoLink}>
                                <span className={styles.repoName}>{repository.name}</span>
                                <SiGithub />
                            </Link>
                            {repository.description && (
                                <p className={styles.repoDescription}>{repository.description}</p>
                            )}
                            <div className={styles.meta}>
                                {repository.languages.length > 0 ? (
                                        <span className={styles.languages}>
                                            {repository.languages.map(({ name }) => (
                                                <span key={name} className={styles.language}>{name}</span>
                                            ))}
                                        </span>
                                    )
                                    :
                                    <span className={styles.noLanguage}>No language</span>
                                }
                                <span><span className={styles.star}>★</span> {repository.stargazers_count}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </TerminalWindow>
    );
}
