import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'
import { getTrackOffset } from '../logic/TrackLogic'

export function CameraFollow() {
    const playerZ = useGameStore((state) => state.distance)

    useFrame((state) => {
        // Camera follows player
        // Player is at Z = -distance

        // Calculate ideal camera position based on curve
        // We want camera to be behind player, but also aligned with the track's curve at camera's Z
        const cameraZ = -playerZ + 8 // Closer to player (was 10)
        const { x: curveX } = getTrackOffset(cameraZ) // Camera follows track path

        const targetZ = -playerZ + 8
        const targetY = 3 // Lower camera (was 5) for more immersive view
        // Camera X should follow the track curve at its position
        const targetX = curveX

        // Smooth lerp
        state.camera.position.lerp(new Vector3(targetX, targetY, targetZ), 0.1)

        // Look ahead on the track
        const lookAtZ = -playerZ - 15 // Look closer (was -20)
        const { x: lookAtX } = getTrackOffset(lookAtZ)
        state.camera.lookAt(lookAtX, 1, lookAtZ) // Look slightly above ground (Y=1)
    })

    return null
}
