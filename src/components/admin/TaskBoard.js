'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLastUpdated } from '@hooks/useLastUpdated';
import TerminalWindow from '@components/shared/TerminalWindow';
import styles from '@styles/component/TaskBoard.module.css';

const ACCENTS = [ '#5EEAD4', '#F472B6', '#FBBF24', '#A78BFA', '#34D399', '#60A5FA', '#FB923C', '#F87171' ];

function generateUniqueId(name, existing) {
    let base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    if (!base) {
        base = 'task';
    }

    let id = base;
    let i = 2;

    while (existing.includes(id)) {
        id = `${base}-${i}`;
        i++;
    }

    return id;
}

export default function TaskBoard({ initialTasks, initialUpdate }) {
    const router = useRouter();
    const nextAccentIdx = useRef(initialTasks.length % ACCENTS.length);
    const [ tasks, setTasks ] = useState(initialTasks);
    const [ addingTask, setAddingTask ] = useState(false);
    const [ newTaskName, setNewTaskName ] = useState('');
    const [ drafts, setDrafts ] = useState({});
    const [ confirmDelete, setConfirmDelete ] = useState(null);
    const [ updatedAt, setUpdatedAt ] = useState(initialUpdate);
    const lastUpdatedLabel = useLastUpdated(updatedAt);

    const persist = useCallback(async (data) => {
        try {
            const response = await fetch('/api/admin/task-board', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.status === 401) {
                router.push('/admin');
                return;
            }

            if (response.ok) {
                const { updatedAt: savedAt } = await response.json();
                setUpdatedAt(savedAt);
            }
        }
        catch {
            console.error('Failed to save task board:', error);
        }
    }, [ router ]);

    const toggleItem = (taskId, itemId) => {
        const next = tasks.map((task) => task.id === taskId ? { ...task, task_items: task.task_items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)) } : task);

        setTasks(next);
        persist(next);
    };

    const removeItem = (taskId, itemId) => {
        const next = tasks.map((task) => task.id === taskId ? { ...task, task_items: task.task_items.filter((item) => item.id !== itemId) } : task);

        setTasks(next);
        persist(next);
    };

    const addItem = (taskId) => {
        const text = (drafts[taskId] || '').trim();

        if (!text) {
            return;
        }

        const newItem = { id: `${taskId}-${Date.now()}`, text, done: false };
        const next = tasks.map((task) => task.id === taskId ? { ...task, task_items: [ ...task.task_items, newItem ] } : task);

        setTasks(next);
        persist(next);
        setDrafts((previous) => ({ ...previous, [taskId]: '' }));
    };

    const addTask = () => {
        const name = newTaskName.trim();

        if (!name) {
            setAddingTask(false);
            return;
        }

        const id = generateUniqueId(name, tasks.map((task) => task.id));
        const accent = ACCENTS[nextAccentIdx.current % ACCENTS.length];
        nextAccentIdx.current += 1;

        const next = [ ...tasks, { id, name, accent, task_items: [] } ];

        setTasks(next);
        persist(next);
        setNewTaskName('');
        setAddingTask(false);
    };

    const deleteTask = (id) => {
        const next = tasks.filter((task) => task.id !== id);

        setTasks(next);
        persist(next);
        setConfirmDelete(null);
    };

    return (
        <>
            <TerminalWindow title='rafi@codes: /root/tickets' className={styles.terminal}>
                <div className={styles.board}>
                    {tasks.map((task) => {
                        const items = task.task_items || [];
                        const doneCount = items.filter((item) => item.done).length;
                        const total = items.length;
                        const percentComplete = total ? Math.round((doneCount / total) * 100) : 0;
                        const pendingDelete = confirmDelete === task.id;

                        return (
                            <section key={task.id} className={styles.column}>
                                <div className={styles.hostRow}>
                                    <span className={styles.dot} style={{ backgroundColor: task.accent }} />
                                    <span className={styles.host} title={task.name}>{task.name}</span>
                                    {!pendingDelete ? (
                                        <button onClick={() => setConfirmDelete(task.id)} className={styles.colDelBtn} aria-label='Delete project'>×</button>
                                    )
                                    :
                                    (
                                        <span className={styles.confirmRow}>
                                            <button onClick={() => deleteTask(task.id)} className={styles.confirmYes}>Delete?</button>
                                            <button onClick={() => setConfirmDelete(null)} className={styles.confirmNo}>Cancel</button>
                                        </span>
                                    )}
                                </div>

                                <p className={styles.countLine}>{total === 0 ? 'No tickets' : `${doneCount}/${total} closed`}</p>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: `${percentComplete}%`, backgroundColor: task.accent }} />
                                </div>

                                <div className={styles.ticketList}>
                                    {items.length === 0 && (
                                        <p className={styles.emptyState}>No open tickets — add one below</p>
                                    )}
                                    {items.map((item) => (
                                        <div key={item.id} className={styles.ticketRow}>
                                            <button onClick={() => toggleItem(task.id, item.id)} className={styles.checkbox} style={{ borderColor: item.done ? task.accent : undefined, backgroundColor: item.done ? task.accent : undefined }} aria-label={item.done ? 'Mark incomplete' : 'Mark complete'}>
                                                {item.done && (
                                                    <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
                                                        <path d='M1 4L3.5 6.5L9 1' stroke='var(--bg-terminal)' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className={`${styles.ticketText} ${item.done ? styles.ticketDone : ''}`}>{item.text}</span>
                                            <button onClick={() => removeItem(task.id, item.id)} className={styles.delBtn} aria-label='Delete ticket'>×</button>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.addRow}>
                                    <input className={styles.addInput} placeholder='New ticket…' value={drafts[task.id] || ''}
                                        onChange={(e) => setDrafts((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addItem(task.id);
                                            }
                                        }}
                                    />
                                    <button className={styles.addBtn} style={{ backgroundColor: task.accent }} onClick={() => addItem(task.id)}>+</button>
                                </div>
                            </section>
                        );
                    })}

                    <section className={styles.newColumn}>
                        {!addingTask ? ( <button className={styles.newColBtn} onClick={() => setAddingTask(true)}>+ Add project</button>)
                        :
                        (
                            <div className={styles.newColForm}>
                                <input autoFocus className={styles.addInput} placeholder='Project name…' value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addTask();
                                        }
                                        
                                        if (e.key === 'Escape') {
                                            setAddingTask(false);
                                            setNewTaskName('');
                                        }
                                    }}
                                />
                                <div className={styles.newColActions}>
                                    <button className={styles.newColConfirm} onClick={addTask}>Add</button>
                                    <button className={styles.newColCancel} onClick={() => { setAddingTask(false); setNewTaskName(''); }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </TerminalWindow>
            {updatedAt && <p className={styles.updated}>Last updated: {lastUpdatedLabel}</p>}
        </>
    );
}
