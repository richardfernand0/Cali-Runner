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

    useFrame(() => {
        if (collected || !ref.current) return

        // Rotate item
        ref.current.rotation.y += 0.02

        // Simple collision detection
        // Player is at Z = -distance
        // Item is at Z = position[2] (which is local to segment, but segment is at -segmentZ)
        // Wait, Segment passes world position? No, Segment is at world position.
        // Item position is relative to Segment.
        // So World Item Z = SegmentZ + ItemLocalZ
        // SegmentZ is passed as position prop to Segment? No.
        // Segment is <group position={position}>.
        // So Item World Position = group.position + item.position.

        // Actually, checking world distance is easier if we know where the player is.
        // Player X = lane * 3.33
        // Player Z = -distance
        // Player Y = 1 (or more if jumping)

        // We need the world position of this item.
        // Since we can't easily get world position without `getWorldPosition` which is expensive every frame,
        // let's calculate it based on parent segment.
        // But Item doesn't know parent segment position easily without props.
        // Let's assume the passed `position` is relative to the Segment.
        // And we need to know the Segment's Z.
        // This is getting complicated for a decentralized approach.

        // Alternative: Player checks collisions.
        // But Player doesn't know about items.

        // Let's use `getWorldPosition` for now, it's fine for a prototype with < 100 items.
        const worldPos = ref.current.getWorldPosition(new THREE.Vector3())

        const playerX = playerLane * 3.33
        const playerZPos = -playerZ

        const dx = worldPos.x - playerX
        const dz = worldPos.z - playerZPos
        const dy = worldPos.y - 1 // Player Y is ~1

        // Distance check (squared to avoid sqrt)
        const distSq = dx * dx + dz * dz + dy * dy

        if (distSq < 2) { // Threshold
            collectItem(item)
            setCollected(true)
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
