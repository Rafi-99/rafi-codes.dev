'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Model from '@components/Model';
import styles from '@styles/page/error.module.css';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [ error ]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>
                <p className={styles.code}>500</p>
                <h1>Internal Server Error</h1>
                <p>Sorry, this was caused by an issue on our end.</p>
                <Link href='/' className={styles.home}>$ cd ~</Link>
            </div>

            <div className={styles.shapes}>
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[ 10, 10, 10 ]} angle={0.15} penumbra={1} />
                    <pointLight position={[ -10, -10, -10 ]} />
                    <Model position={[ 0, 0, 0 ]} scale={[ 0.3, 0.15 ]} type='torusKnot' />
                    <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
                    <Stars />
                </Canvas>
            </div>
        </div>
    );
};
