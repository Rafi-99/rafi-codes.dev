import Link from 'next/link';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { MdHome } from 'react-icons/md';
import Model from '../components/Model';
import styles from '../styles/pages/404.module.css';

export default function Custom404() {
    return (
        <>
            <h1 className={styles.text}>404 | Not Found</h1>
            <p className={styles.text}>It looks like the page you are looking for does not exist.</p>
            <p className={styles.text}>Let&apos;s get you back home.</p>
            <Link href='/'><a className={styles.text}><MdHome fontSize='2rem' className={styles.home} /></a></Link>

            <div className={styles.shapes}>
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Model position={[0, 0, 0]} scale={[0.25, 0.2]} type='torus' />
                    <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
                    <Stars />
                </Canvas>
            </div>
        </>
    );
};