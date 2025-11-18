import { Environment, Sky, Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'

export function Scene() {
    return (
        <>
            <color attach="background" args={['#87CEEB']} />
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <fog attach="fog" args={['#87CEEB', 20, 90]} />

            <Sky sunPosition={[10, 20, 10]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.7} />

            <Clouds material={THREE.MeshBasicMaterial}>
                <Cloud seed={1} scale={2} volume={5} color="white" fade={100} />
                <Cloud seed={2} scale={1} volume={3} color="white" fade={100} position={[20, 10, -20]} />
            </Clouds>

            <Environment preset="forest" />
        </>
    )
}
