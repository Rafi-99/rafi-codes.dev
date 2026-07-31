'use client';

import { useEffect, useState } from 'react';

const TypingState = {
    Typing: '▶️',
    Pausing: '⏸️',
    Deleting: '⏪',
};

const typingIntervalMin = 100;
const typingIntervalMax = 150;
const typingPause = 2000;
const deleteInterval = 50;
const deletePause = 500;
const getRandomTypingInterval = () => Math.floor(Math.random() * (typingIntervalMax - typingIntervalMin + 1)) + typingIntervalMin;

// Segment by grapheme clusters so emoji sequences like 💪🏾 (base + skin
// tone modifier) are treated as a single, atomic character — no flashing
// between the default color and the chosen skin tone. Neither of these
// depends on props/state, so they live at module scope — one segmenter
// shared across renders (and across every instance of this hook) instead
// of a new one being constructed every render.
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const chars = (charString) => [...segmenter.segment(charString)].map((s) => s.segment);

export default function useTypingEffect(words) {
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ currentTypingState, setCurrentTypingState ] = useState(TypingState.Typing);
    const [ currentWord, setCurrentWord ] = useState('');

    useEffect(() => {
        switch (currentTypingState) {
            case TypingState.Typing: {
                const wordChars = chars(words[currentIndex]);
                const typedChars = chars(currentWord);
                const nextWord = wordChars.slice(0, typedChars.length + 1).join('');

                if (nextWord === currentWord) {
                    const timeout = setTimeout(() => setCurrentTypingState(TypingState.Pausing), 0);
                    return () => clearTimeout(timeout);
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
                    }, deletePause);

                    return () => clearTimeout(timeout);
                }

                const wordChars = chars(words[currentIndex]);
                const typedChars = chars(currentWord);
                const remainingChars = wordChars.slice(0, typedChars.length - 1).join('');
                const timeout = setTimeout(() => setCurrentWord(remainingChars), deleteInterval);

                return () => clearTimeout(timeout);
            }

            case TypingState.Pausing:
            default: {
                const timeout = setTimeout(() => setCurrentTypingState(TypingState.Deleting), typingPause);
                return () => clearTimeout(timeout);
            }
        }
    }, [ words, currentWord, currentIndex, currentTypingState ]);

    return [ currentWord ];
}
