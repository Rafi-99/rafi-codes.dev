import Link from 'next/link';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { MdHome } from 'react-icons/md';
import Model from '../components/Model';
import styles from '../styles/pages/500.module.css';

export default function Custom500() {
    return (
        <>
            <h1 className={styles.text}>500 | Internal Server Error</h1>
            <p className={styles.text}>Sorry for the inconvenience. This was caused by an issue on our end, not you.</p>
            <p className={styles.text}>Let&apos;s get you back home.</p>
            <Link href='/' className={styles.text}><MdHome fontSize='2rem' className={styles.home} /></Link>

            <div className={styles.shapes}>
                <Canvas>
                    <ambientLight intensity={0.2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Model position={[0, 0, 0]} scale={[0.3, 0.15]} type='sphere' />
                    <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
                    <Stars />
                </Canvas>
            </div>
        </>
    );
};