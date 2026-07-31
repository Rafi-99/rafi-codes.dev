'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Model(props) {
    const mesh = useRef();
    const [ clicked, setClicked ] = useState(false);
    const [ hovered, setHover ] = useState(false);

    useFrame(() => {
        if (props.type === 'cube') {
            mesh.current.rotation.x = mesh.current.rotation.z += 0.05;
            mesh.current.rotation.y = mesh.current.rotation.y += 0.05;
            mesh.current.rotation.z = mesh.current.rotation.x += 0.05;
        }
        else if (props.type === 'torusKnot') {
            mesh.current.rotation.x += 0.005;
            mesh.current.rotation.y += 0.015;
        }
        else if (props.type === 'torus') {
            mesh.current.rotation.x = mesh.current.rotation.y += 0.05;
        }
        else {
            mesh.current.rotation.y += 0.05;
        }
    });

    return (
        <mesh {...props} ref={mesh} scale={clicked ? props.scale[0] : props.scale[1]} onClick={() => setClicked(!clicked)} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            { props.type === 'cube' ? (
                    <>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshLambertMaterial color={hovered ? '#0a0d12' : '#6ee7a5'}/>
                    </>
                )
                : props.type === 'torusKnot' ? (
                    <points>
                        <torusKnotGeometry args={[10, 3, 200, 32]} />
                        <pointsMaterial color={hovered ? '#6ee7a5' : '#e6edf3'} size={0.005}/>
                    </points>
                )
                : props.type === 'torus' ? (
                    <points>
                        <torusGeometry args={[10, 3, 30, 200, 100]} />
                        <pointsMaterial color={hovered ? '#6ee7a5' : '#e6edf3'} size={0.005}/>
                    </points>
                )
                : null
            }
        </mesh>
    );
}
