'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from '@styles/component/InteractiveTerminal.module.css';

const ROUTES = { about: '/about', projects: '/projects', contact: '/contact', home: '/', '~': '/' };
const COMMANDS = ['help', 'whoami', 'ls', 'cd', 'clear', 'exit', 'sudo', 'date', 'echo', 'rm', 'vim', 'coffee'];

const HELP = {
    help: { usage: 'help', detail: 'Shows this list.' },
    whoami: { usage: 'whoami', detail: 'Who am I, really?' },
    ls: { usage: 'ls', detail: 'Lists the pages you can cd into.' },
    cd: {
        usage: 'cd <page>',
        detail: 'Goes to /about, /projects, /contact, or /home.'
    },
    echo: { usage: 'echo <text>', detail: 'Prints text back to the screen.' },
    date: { usage: 'date', detail: 'Shows the current date and time.' },
    sudo: { usage: 'sudo <cmd>', detail: 'Try it and see ;)' },
    clear: { usage: 'clear', detail: 'Clears everything printed to the console.' },
    exit: { usage: 'exit', detail: 'Closes this terminal (ESC works too).' }
};

export default function InteractiveTerminal({ active, onExit }) {
    const router = useRouter();
    const [ history, setHistory ] = useState([]);
    const [ input, setInput ] = useState('');
    const [ cmdHistory, setCmdHistory ] = useState([]);
    const [ historyIndex, setHistoryIndex ] = useState(-1);
    const [ exiting, setExiting ] = useState(false);
    const [ suggestions, setSuggestions ] = useState([]);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const [ cursorPos, setCursorPos ] = useState(0);

    useEffect(() => {
        if (active) {
            inputRef.current?.focus();
        }
    }, [ active ]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, [ history ]);

    const syncCursor = (e) => setCursorPos(e.target.selectionStart ?? e.target.value.length);
    const print = (command, output) => setHistory((h) => [ ...h, { command, output } ]);

    const triggerExit = (label = 'exit', message = 'Logging out...') => {
        if (exiting) {
            return;
        }

        setExiting(true);
        print(label, message);
        setInput('');
        setCursorPos(0);
        setSuggestions([]);

        setTimeout(() => {
            setHistory([]);
            setExiting(false);
            onExit();
        }, 500);
    };

    const runCommand = (raw) => {
        const trimmed = raw.trim();

        if (!trimmed) {
            return;
        }

        const [ cmd, ...args ] = trimmed.split(/\s+/);
        const arg = args.join(' ');

        switch (cmd) {
            case 'help':
                print(trimmed, <span className={styles.helpList}><span className={styles.helpIntro}>commands:</span>{Object.entries(HELP).map(([key, { usage, detail }]) => (<span key={key} className={styles.helpRow}><span className={styles.helpUsage}>{usage}</span><span className={styles.helpDetail}>{detail}</span></span>))}</span>);
                break;
            case 'whoami':
                print(trimmed, 'Rafi — Full-Stack Software Engineer. Probably debugging something right now...');
                break;
            case 'ls':
                print(trimmed, 'about/  projects/  contact/  home/');
                break;
            case 'cd': {
                const target = arg.replace(/^~\/?/, '').replace(/\/$/, '') || 'home';
                if (target === 'home') {
                    triggerExit(trimmed, '→ ~');
                }
                else if (ROUTES[target] !== undefined) {
                    print(trimmed, `→ ${ROUTES[target] === '/' ? '~' : `~/${target}`}`);
                    setTimeout(() => router.push(ROUTES[target]), 400);
                }
                else {
                    print(trimmed, `cd: ${arg}: No such directory.`);
                }
                break;
            }
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                triggerExit(trimmed);
                break;
            case 'sudo':
                print(trimmed, arg === 'make me a sandwich' ? 'Okay.\n🥪' : 'Nice try. This incident has been reported.');
                break;
            case 'date':
                print(trimmed, new Date().toString());
                break;
            case 'echo':
                print(trimmed, arg);
                break;
            case 'rm':
                print(trimmed, arg.includes('-rf') ? 'Nice try — this terminal is read-only.' : `rm: ${arg || 'missing operand'}: No such file.`);
                break;
            case 'vim':
                print(trimmed, 'Entering vim... just kidding. Nobody escapes vim.');
                break;
            case 'coffee':
                print(trimmed, '☕ Brewing...');
                break;
            default:
                print(trimmed, `command not found: ${cmd}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            runCommand(input);
            setCmdHistory((h) => [ ...h, input ]);
            setHistoryIndex(-1);
            setInput('');
            setCursorPos(0);
            setSuggestions([]);
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestions.length) {
                setInput(suggestions[0]);
                setCursorPos(suggestions[0].length);
                setSuggestions([]);
            }
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!cmdHistory.length) {
                return;
            }

            const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(nextIndex);
            setInput(cmdHistory[nextIndex]);
            setCursorPos(cmdHistory[nextIndex].length);
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === -1) {
                return;
            }

            const nextIndex = historyIndex + 1;

            if (nextIndex >= cmdHistory.length) {
                setHistoryIndex(-1);
                setInput('');
                setCursorPos(0);
            }
            else {
                setHistoryIndex(nextIndex);
                setInput(cmdHistory[nextIndex]);
                setCursorPos(cmdHistory[nextIndex].length);
            }
        }
        else if (e.key === 'Escape') {
            triggerExit();
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        setSuggestions(value.trim() ? COMMANDS.filter((c) => c.startsWith(value.trim().toLowerCase())) : []);
    };

    return (
        <div className={styles.shell} onClick={() => inputRef.current?.focus()}>
            <div className={styles.history}>
                {history.map((entry, i) => (
                        <div key={i} className={styles.entry}>
                            <p className={styles.line}><span className={styles.prompt}>rafi@codes:~$</span>{entry.command}</p>
                            {entry.output && <p className={styles.output}>{entry.output}</p>}
                        </div>
                    ))
                }
                <div className={styles.inputLine}>
                    <span className={styles.prompt}>rafi@codes:~$</span>
                    <span className={styles.lineText}>
                        {input.slice(0, cursorPos)}
                        <span className={styles.blockCursor}>{input[cursorPos] ?? '\u00A0'}</span>
                        {input.slice(cursorPos + 1)}
                        {!input && (<span className={styles.hint}>Type <strong>help</strong> for a full list of commands. Pssst — try: sudo make me a sandwich</span>)}
                    </span>
                    <input ref={inputRef} className={styles.hiddenInput} value={input}
                        onChange={(e) => {
                            handleChange(e);
                            syncCursor(e);
                        }}
                        onKeyDown={handleKeyDown} onKeyUp={syncCursor} onClick={syncCursor} onSelect={syncCursor} autoComplete='off' autoCapitalize='off' autoCorrect='off' spellCheck='false' inputMode='text' aria-label='Terminal command input'/>
                </div>
                {suggestions.length > 0 && (
                    <div className={styles.suggestions}>
                        {suggestions.map((s) => (
                            <button key={s} type='button'
                                onClick={() => {
                                    setInput(s);
                                    setCursorPos(s.length);
                                    setSuggestions([]);
                                    inputRef.current?.focus();
                                }}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
