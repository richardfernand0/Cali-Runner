import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'

import { useGameStore } from '../../store/gameStore'
import { getTrackOffset } from '../../logic/TrackLogic'

const LANE_WIDTH = 3.33
const JUMP_FORCE = 8
const GRAVITY = 20

export function Character() {
    const mesh = useRef<any>(null)
    const lane = useGameStore((state) => state.lane)
    const setLane = useGameStore((state) => state.setLane)

    // Local state for physics
    const [velocity, setVelocity] = useState(0)
    const [isJumping, setIsJumping] = useState(false)

    // Refactoring to track local lane position
    const currentLaneX = useRef(0)

    // Handle input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                if (lane > -1) setLane(lane - 1)
            } else if (e.key === 'ArrowRight') {
                if (lane < 1) setLane(lane + 1)
            } else if (e.key === ' ' || e.key === 'ArrowUp') {
                if (!isJumping) {
                    setVelocity(JUMP_FORCE)
                    setIsJumping(true)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [lane, isJumping, setLane])

    useFrame((_, delta) => {
        if (!mesh.current) return

        const distance = useGameStore.getState().distance

        // 1. Update Lane Position (Smooth)
        const targetLaneX = lane * LANE_WIDTH
        currentLaneX.current += (targetLaneX - currentLaneX.current) * 10 * delta

        // Wobble effect (Low Energy)
        const energy = useGameStore.getState().metrics.energy
        const wobble = energy < 30 ? Math.sin(Date.now() * 0.01) * ((30 - energy) / 30) * 0.5 : 0

        // 2. Calculate World Position based on Curve
        const { x: curveX, rotation } = getTrackOffset(-distance)

        // 3. Apply to Mesh
        // mesh.current.position.x = curveX + currentLaneX.current * Math.cos(rotation)
        // mesh.current.position.z = -distance + currentLaneX.current * Math.sin(rotation) // Slight Z offset if banking? Actually just -distance is fine for simple runner
        // Better:
        mesh.current.position.x = curveX + currentLaneX.current + wobble
        mesh.current.position.z = -distance

        mesh.current.rotation.y = rotation

        // Jump physics
        if (isJumping) {
            mesh.current.position.y += velocity * delta
            setVelocity(prev => prev - GRAVITY * delta)

            // Ground collision
            if (mesh.current.position.y <= 1) { // 1 is half height (2/2)
                mesh.current.position.y = 1
                setVelocity(0)
                setIsJumping(false)
            }
        }
    })

    return (
        <mesh ref={mesh} position={[0, 1, 0]} castShadow>
            <capsuleGeometry args={[0.5, 1, 4, 8]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    )
}
