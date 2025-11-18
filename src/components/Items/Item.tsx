import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/gameStore'
import type { FoodItem } from '../../logic/NutritionEngine'

export function Item({ item, position }: { item: FoodItem, position: [number, number, number] }) {
    const ref = useRef<any>(null)
    const [collected, setCollected] = useState(false)
    const collectItem = useGameStore((state) => state.collectItem)
    const playerZ = useGameStore((state) => state.distance)
    const playerLane = useGameStore((state) => state.lane)

    useFrame((state) => {
        if (collected || !ref.current) return

        // Rotate item - use time for smooth rotation independent of frame rate
        ref.current.rotation.y = state.clock.elapsedTime * 2

        // Optimization: Only check collision if player is close enough in Z
        // Player Z is -playerZ. Item Z is roughly -playerZ + relativeZ.
        // We can just check world distance.

        const playerZPos = -playerZ

        // Quick Z check before expensive world position calculation
        // We don't know item world Z easily without calculation, but we can guess.
        // Actually, getWorldPosition is not THAT expensive for < 50 items.
        // But let's throttle it? No, collision needs to be precise.

        // Let's just optimize the math.
        const worldPos = ref.current.getWorldPosition(new THREE.Vector3())
        const dz = worldPos.z - playerZPos

        // Only check full collision if Z difference is small
        if (Math.abs(dz) < 2) {
            const playerX = playerLane * 3.33
            const dx = worldPos.x - playerX
            const dy = worldPos.y - 1

            const distSq = dx * dx + dz * dz + dy * dy

            if (distSq < 2) {
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
