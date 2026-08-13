'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DateTime from '@components/DateTime';
import TypeWriter from '@components/TypeWriter';
import InteractiveTerminal from '@components/InteractiveTerminal';
import TerminalWindow from '@components/TerminalWindow';
import styles from '@styles/component/HomeTerminal.module.css';

export default function HomeTerminal() {
    const [ terminalMode, setTerminalMode ] = useState(false);
    const [ crackling, setCrackling ] = useState(false);

    const toggleMode = (next) => {
        setCrackling(true);
        setTerminalMode(next);
        window.setTimeout(() => setCrackling(false), 420);
    };

    useEffect(() => {
        const handleReset = () => {
            if (terminalMode) {
                toggleMode(false);
            }
        };

        window.addEventListener('home:reset', handleReset);
        return () => window.removeEventListener('home:reset', handleReset);
    }, [ terminalMode ]);

    return (
        <TerminalWindow title='rafi@codes: ~' className={styles.terminal} variant='ambient'>
            <div className={`${styles.content} ${crackling ? styles.crackling : ''}`}>
                <motion.div className={styles.layer} initial={{ opacity: !terminalMode ? 1 : 0 }} animate={{ opacity: terminalMode ? 0 : 1 }} transition={{ duration: 0.25 }} style={{ pointerEvents: terminalMode ? 'none' : 'auto' }} aria-hidden={terminalMode} inert={terminalMode || undefined}>
                    <div className={styles.profile}><Image src='/assets/images/profile.png' width={140} height={140} alt='A picture of Rafi.' className={styles.picture} priority /></div>

                    <div className={styles.commandBlock}>
                        <p className={styles.greeting}><span className={styles.promptSymbol}>rafi@codes:~$</span> cat welcome.txt</p>
                        <p className={styles.greeting}>Hello! I&apos;m Rafi. 👋🏾</p>
                        <TypeWriter />
                    </div>
                    <DateTime />

                    <div className={styles.links}>
                        <Link href='/about'><button>$ cd ~/about</button></Link>
                        <Link href='/projects'><button>$ cd ~/projects</button></Link>
                        <Link href='/contact'><button>$ cd ~/contact</button></Link>
                        <button onClick={() => toggleMode(true)} className={styles.sudo}>$ sudo -i</button>
                    </div>
                </motion.div>

                <motion.div className={`${styles.layer} ${styles.terminalLayer}`} initial={{ opacity: terminalMode ? 1 : 0 }} animate={{ opacity: terminalMode ? 1 : 0 }} transition={{ duration: 0.25 }} style={{ pointerEvents: terminalMode ? 'auto' : 'none' }} aria-hidden={!terminalMode} inert={!terminalMode || undefined}>
                    <InteractiveTerminal active={terminalMode} onExit={() => toggleMode(false)} />
                </motion.div>
            </div>
        </TerminalWindow>
    );
}
