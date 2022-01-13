import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Form from '../components/Form';
import styles from '../styles/pages/contact.module.css';

export default function Contact() {
    return (
        <>
            <Form />
            <Canvas className={styles.canvas}>
                <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
                <Stars radius={500} depth={50} count={5000} factor={10} />
            </Canvas>
        </>
    );
};

Contact.defaultProps = {
    title: 'Rafi Codes | Contact Me',
    description: 'Use this page to get in touch with me!',
    url: 'https://www.rafi-codes.dev/contact',
    image: '/assets/images/profile.png'
};