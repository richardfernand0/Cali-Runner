import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function GameManager() {
    const tick = useGameStore((state) => state.tick)
    const status = useGameStore((state) => state.status)
    const pauseGame = useGameStore((state) => state.pauseGame)
    const resumeGame = useGameStore((state) => state.resumeGame)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                const currentStatus = useGameStore.getState().status
                if (currentStatus === 'playing') {
                    pauseGame()
                } else if (currentStatus === 'paused') {
                    resumeGame()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [pauseGame, resumeGame])

    useFrame((_, delta) => {
        if (status === 'playing') {
            tick(delta)
        }
    })

    return null
}
