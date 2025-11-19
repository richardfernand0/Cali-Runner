import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

import { useGameStore } from '../../store/gameStore'
import { getTrackOffset } from '../../logic/TrackLogic'

const LANE_WIDTH = 3.33
const JUMP_FORCE = 8
const GRAVITY = 20

export function Character() {
    const group = useRef<any>(null)
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
        if (!group.current) return

        const distance = useGameStore.getState().distance

        // 1. Update Lane Position (Smooth)
        const targetLaneX = lane * LANE_WIDTH
        currentLaneX.current += (targetLaneX - currentLaneX.current) * 10 * delta

        // Wobble effect (Low Energy)
        const energy = useGameStore.getState().metrics.energy
        const wobble = energy < 30 ? Math.sin(Date.now() * 0.01) * ((30 - energy) / 30) * 0.5 : 0

        // 2. Calculate World Position based on Curve
        const { x: curveX, rotation } = getTrackOffset(-distance)

        // 3. Apply to Group
        group.current.position.x = curveX + currentLaneX.current + wobble
        group.current.position.z = -distance

        // Rotate the group to follow track
        group.current.rotation.y = rotation

        // Jump physics
        if (isJumping) {
            group.current.position.y += velocity * delta
            setVelocity(prev => prev - GRAVITY * delta)

            // Ground collision
            if (group.current.position.y <= 1) { // 1 is half height (2/2)
                group.current.position.y = 1
                setVelocity(0)
                setIsJumping(false)
            }
        }
    })

    const status = useGameStore((state) => state.status)

    return (
        <group ref={group} position={[0, 1, 0]}>
            {/* 
                Using Html transform to render the GIF. 
                This ensures the GIF animation plays correctly.
                'transform' makes it move with the 3D object.
                'sprite' makes it always face the camera.
            */}
            <Html
                transform
                sprite
                position={[0, 0.5, 0]}
                style={{
                    pointerEvents: 'none',
                    display: status === 'playing' ? 'block' : 'none'
                }}
                zIndexRange={[100, 0]}
            >
                <div className="w-32 h-32 flex items-center justify-center">
                    <img
                        src="/character.gif"
                        alt="character"
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
            </Html>

            {/* Shadow blob */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
                <circleGeometry args={[0.4, 32]} />
                <meshBasicMaterial color="black" transparent opacity={0.3} />
            </mesh>
        </group>
    )
}
