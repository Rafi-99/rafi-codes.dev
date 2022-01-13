import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Model(props) {
    const mesh = useRef();
    const [ clicked, setClicked ] = useState(false);
    const [ hovered, setHover ] = useState(false);

    useFrame(() => {
        if (props.type === 'cube') {
            mesh.current.rotation.x = mesh.current.rotation.z += 0.01;
            mesh.current.rotation.y = mesh.current.rotation.y += 0.01;
            mesh.current.rotation.z = mesh.current.rotation.x += 0.01;
        }
        else if (props.type === 'sphere') {
            mesh.current.rotation.x = mesh.current.rotation.x += 0.01;
            mesh.current.rotation.y = mesh.current.rotation.y += 0.01;
            mesh.current.rotation.z = mesh.current.rotation.y += 0.01;
        }
        else if (props.type === 'torus') {
            mesh.current.rotation.x = mesh.current.rotation.y += 0.05;
        }
        else {
            mesh.current.rotation.y += 0.03;
        }
    });

    return (
        <mesh {...props} ref={mesh} scale={clicked ? props.scale[0] : props.scale[1]} onClick={() => setClicked(!clicked)} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {props.type === 'cube' ? (
                <>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshLambertMaterial color={hovered ? 'black' : 'gold'} />
                </>
            ) : props.type === 'sphere' ? (
                <points>
                    <sphereGeometry args={[17, 100, 100]} />
                    <pointsMaterial color={hovered ? 'gold' : 'white'} size={0} />
                </points>
            ) : props.type === 'torus' ? (
                <points>
                    <torusGeometry args={[10, 3, 30, 200, 100]} />
                    <pointsMaterial color={hovered ? 'gold' : 'white'} size={0.005} />
                </points>
            ) : null}
        </mesh>
    );
};