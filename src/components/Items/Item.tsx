import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/gameStore'
import type { FoodItem } from '../../logic/NutritionEngine'

export function Item({ item, position, segmentZ }: { item: FoodItem, position: [number, number, number], segmentZ: number }) {
    const ref = useRef<any>(null)
    const [collected, setCollected] = useState(false)
    const collectItem = useGameStore((state) => state.collectItem)
    const playerZ = useGameStore((state) => state.distance)
    const playerLane = useGameStore((state) => state.lane)

    useFrame((state) => {
        if (collected || !ref.current) return

        // Rotate item
        ref.current.rotation.y = state.clock.elapsedTime * 2

        // Analytical Collision Detection
        // World Z of item is roughly: -segmentZ + position[2]
        // This ignores the curve rotation's effect on Z, but for collision "trigger" it's close enough to start checking.
        const itemWorldZApprox = -segmentZ + position[2]
        const playerZPos = -playerZ // Player is at -distance

        // Only do expensive check if we are close in Z
        if (Math.abs(itemWorldZApprox - playerZPos) < 5) {
            // Now we can do the precise check
            const worldPos = ref.current.getWorldPosition(new THREE.Vector3())
            const dx = worldPos.x - (playerLane * 3.33)
            const dz = worldPos.z - playerZPos
            const dy = worldPos.y - 1

            if (dx * dx + dz * dz + dy * dy < 2) {
                collectItem(item)
                setCollected(true)
            }
        }
    })

    if (collected) return null

    return (
        <group position={position} ref={ref}>
            <mesh castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={item.color} />
            </mesh>
        </group>
    )
}

import * as THREE from 'three'
