'use client';

import { useRef } from 'react';
import { Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import styles from '@styles/component/AmbientBackground.module.css';

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
};

export default function AmbientBackground() {
    return (
        <div className={styles.wrapper} aria-hidden='true'>
            <div className={styles.glow} />
            <Canvas className={styles.canvas} style={{ width: '100%', height: '100%' }} camera={{ position: [ 0, 0, 5 ], fov: 70 }} dpr={[ 1, 1.5 ]} gl={{ alpha: true, antialias: false }}>
                <DriftingStars />
            </Canvas>
        </div>
    );
};
