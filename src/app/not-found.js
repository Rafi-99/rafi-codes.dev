'use client';

import Link from 'next/link';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Model from '@components/shared/Model';
import styles from '@styles/page/error.module.css';

export default function NotFound() {
    return (
        <div className='page-flex status-wrapper'>
            <div className='status-text'>
                <p className={styles.code}>404</p>
                <h1>Not Found</h1>
                <p>The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link href='/' className='pushable accent'>$ cd ~</Link>
            </div>

            <div className={styles.shapes}>
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[ 10, 10, 10 ]} angle={0.15} penumbra={1} />
                    <pointLight position={[ -10, -10, -10 ]} />
                    <Model position={[ 0, 0, 0 ]} scale={[ 0.25, 0.2 ]} type='torus' />
                    <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
                    <Stars />
                </Canvas>
            </div>
        </div>
    );
}
