'use client';

import { useEffect, useRef, useState } from 'react';
import { Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import styles from '@styles/component/AmbientBackground.module.css';

function ContextLossHandler({ onLost }) {
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl.domElement;

        const handleLost = (event) => {
            event.preventDefault();
            onLost();
        };

        canvas.addEventListener('webglcontextlost', handleLost);
        return () => canvas.removeEventListener('webglcontextlost', handleLost);
    }, [ gl, onLost ]);

    return null;
}

function DriftingStars() {
    const group = useRef();
    const reduceMotion = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    useFrame((state, delta) => {
        if (reduceMotion.current) {
            return;
        }

        group.current.rotation.y += delta * 0.015;
        group.current.rotation.x += delta * 0.005;
    });

    return (
        <group ref={group}>
            <Stars radius={70} depth={50} count={2500} factor={3} saturation={0} fade speed={0.5} />
        </group>
    );
}

export default function AmbientBackground() {
    const [ canvasKey, setCanvasKey ] = useState(0);

    return (
        <div className={styles.wrapper} aria-hidden='true'>
            <div className={styles.glow} />
            <Canvas key={canvasKey} className={styles.canvas} style={{ width: '100%', height: '100%' }} camera={{ position: [ 0, 0, 5 ], fov: 70 }} dpr={[ 1, 1.5 ]} gl={{ alpha: true, antialias: false }}>
                <ContextLossHandler onLost={() => setCanvasKey((key) => key + 1)} />
                <DriftingStars />
            </Canvas>
        </div>
    );
}
