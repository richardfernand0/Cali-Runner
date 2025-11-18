import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'

export function GameManager() {
    const tick = useGameStore((state) => state.tick)
    const status = useGameStore((state) => state.status)

    useFrame((_, delta) => {
        if (status === 'playing') {
            tick(delta)
        }
    })

    return null
}
