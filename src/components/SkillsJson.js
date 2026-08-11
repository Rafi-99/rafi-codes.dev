'use client';

import { useState } from 'react';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import styles from '@styles/component/SkillsJson.module.css';

const ITEMS_PER_LINE = 5;

function toKey(category) {
    return category.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function chunk(arr, size) {
    const chunks = [];

    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }

    return chunks;
}

export default function SkillsJson({ skills }) {
    const [ copied, setCopied ] = useState(false);

    const data = skills.reduce((acc, skill) => {
        acc[toKey(skill.category)] = skill.description.split(',').map((s) => s.trim());
        return acc;
    }, {});

    const entries = Object.entries(data);
    const json = JSON.stringify(data, null, 4);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    let lineNumber = 0;
    const nextNumber = () => ++lineNumber;
    const rows = [];

    rows.push({ number: nextNumber(), indent: 0, content: <span className={styles.punct}>{'{'}</span> });

    entries.forEach(([ key, values ], entryIndex) => {
        const isLast = entryIndex === entries.length - 1;

        rows.push({ number: nextNumber(), indent: 1, content: (<><span className={styles.key}>&quot;{key}&quot;</span><span className={styles.punct}>: [</span></>) });

        const itemChunks = chunk(values, ITEMS_PER_LINE);

        itemChunks.forEach((itemsInLine, chunkIndex) => {
            const isLastChunk = chunkIndex === itemChunks.length - 1;
            rows.push({ number: nextNumber(), indent: 2, content: itemsInLine.map((value, i) => (<span key={value}><span className={styles.string}>&quot;{value}&quot;</span>{(i < itemsInLine.length - 1 || !isLastChunk) && <span className={styles.punct}>, </span>}</span>)) });
        });

        rows.push({ number: nextNumber(), indent: 1, content: <span className={styles.punct}>]{isLast ? '' : ','}</span> });
    });

    rows.push({ number: nextNumber(), indent: 0, content: <span className={styles.punct}>{'}'}</span> });

    return (
        <div className={styles.wrapper}>
            <div className={styles.actionsBar}>
                <button type='button' onClick={handleCopy} className={styles.copyButton} aria-label='Copy skills.json to clipboard'>{copied ? <FaCheck /> : <FaRegCopy />}</button>
                <div className={`${styles.toast} ${copied ? styles.toastVisible : ''}`} role='status' aria-live='polite'>Copied to clipboard!</div>
            </div>
            <pre className={styles.pre}>
                <code>
                    {rows.map((row) => (
                        <div key={row.number} className={styles.codeLine}>
                            <span className={styles.lineNumber}>{row.number}</span>
                            <span className={styles.lineContent} data-indent={row.indent}>{row.content}</span>
                        </div>
                    ))}
                </code>
            </pre>
        </div>
    );
}
