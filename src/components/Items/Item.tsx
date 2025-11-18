import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { getTrackOffset } from '../../logic/TrackLogic'
import type { FoodItem } from '../../logic/NutritionEngine'

export function Item({ item, position, segmentZ }: { item: FoodItem, position: [number, number, number], segmentZ: number }) {
    const ref = useRef<any>(null)
    const [collected, setCollected] = useState(false)
    const collectItem = useGameStore((state) => state.collectItem)
    const playerZ = useGameStore((state) => state.distance)
    const playerLane = useGameStore((state) => state.lane)

    // Generate Emoji Texture
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const context = canvas.getContext('2d')
        if (context) {
            context.font = '96px serif'
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            context.fillText(item.emoji, 64, 70) // Slight offset for centering
        }
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        return tex
    }, [item.emoji])

    useFrame((state, delta) => {
        if (!ref.current) return

        if (collected) {
            // Animation: Scale up and fade out
            ref.current.scale.x += delta * 5
            ref.current.scale.y += delta * 5
            ref.current.position.y += delta * 2

            // Fade out (requires transparent material)
            const material = ref.current.children[0].material
            if (material) {
                material.opacity -= delta * 3
                if (material.opacity <= 0) {
                    // Fully invisible, effectively gone.
                    // We don't unmount to avoid React tree thrashing, just hide.
                    ref.current.visible = false
                }
            }
            return
        }

        // Bobbing animation
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2

        // Always face camera (billboard effect)
        ref.current.lookAt(state.camera.position)

        // Analytical Collision Detection
        const itemWorldZApprox = -segmentZ + position[2]
        const playerZPos = -playerZ

        // Increased Z-threshold to catch fast movement
        if (Math.abs(itemWorldZApprox - playerZPos) < 10) {
            const worldPos = ref.current.getWorldPosition(new THREE.Vector3())

            // Calculate Player's ACTUAL World Position (including curve)
            const { x: playerCurveX } = getTrackOffset(playerZPos)
            const playerWorldX = (playerLane * 3.33) + playerCurveX

            const dx = worldPos.x - playerWorldX
            const dz = worldPos.z - playerZPos
            const dy = worldPos.y - 1 // Player center Y is roughly 1

            // Collision radius 2.5
            if (dx * dx + dz * dz + dy * dy < 2.5) {
                collectItem(item)
                setCollected(true)
            }
        }
    })

    // Don't return null immediately, let animation play
    // if (collected) return null

    return (
        <group position={position} ref={ref}>
            <sprite scale={[1.5, 1.5, 1.5]}>
                <spriteMaterial map={texture} transparent opacity={1} />
            </sprite>
            {/* Add a subtle glow/light matching the item color */}
            {!collected && <pointLight color={item.color} intensity={0.5} distance={3} decay={2} />}
        </group>
    )
}
