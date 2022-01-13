import { useEffect, useState } from 'react';

const TypingState = {
    Typing: '▶️',
    Pausing: '⏸️',
    Deleting: '⏪',
};

const TYPING_INTERVAL_MIN = 100;
const TYPING_INTERVAL_MAX = 150;
const TYPING_PAUSE_MS = 2000;
const DELETING_INTERVAL = 50;
const DELETING_PAUSE_MS = 500;
const getRandomTypingInterval = () => Math.floor(Math.random() * (TYPING_INTERVAL_MAX - TYPING_INTERVAL_MIN + 1)) + TYPING_INTERVAL_MIN;

export default function useTypingEffect(words) {
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ currentTypingState, setCurrentTypingState ] = useState(TypingState.Typing);
    const [ currentWord, setCurrentWord ] = useState('');

    useEffect(() => {
        switch (currentTypingState) {
            case TypingState.Typing: {
                const nextWord = words[currentIndex].slice(0, currentWord.length + 1);

                if (nextWord === currentWord) {
                    setCurrentTypingState(TypingState.Pausing);
                    return;
                }

                const timeout = setTimeout(() => setCurrentWord(nextWord), getRandomTypingInterval());
                return () => clearTimeout(timeout);
            }

            case TypingState.Deleting: {
                if (!currentWord) {
                    const timeout = setTimeout(() => {
                        const nextIndex = currentIndex + 1;
                        setCurrentIndex(words[nextIndex] ? nextIndex : 0);
                        setCurrentTypingState(TypingState.Typing);
                    }, DELETING_PAUSE_MS);

                    return () => clearTimeout(timeout);
                }

                const nextRemaining = words[currentIndex].slice(0, currentWord.length - 1);
                const timeout = setTimeout(() => setCurrentWord(nextRemaining), DELETING_INTERVAL);
                return () => clearTimeout(timeout);
            }

            case TypingState.Pausing:
            default: {
                const timeout = setTimeout(() => setCurrentTypingState(TypingState.Deleting), TYPING_PAUSE_MS);
                return () => clearTimeout(timeout);
            }
        }
    }, [ words, currentIndex, currentTypingState, currentWord ]);

    return [ currentWord ];
};