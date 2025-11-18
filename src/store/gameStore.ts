import { create } from 'zustand'
import type { FoodItem } from '../logic/NutritionEngine'

export type GameStatus = 'idle' | 'playing' | 'paused' | 'ended'

export interface GameMetrics {
    calories: number // 0-1000+ (Burned)
    hydration: number // 0-100 (Percentage)
    energy: number // 0-100 (Percentage)
}

interface GameState {
    status: GameStatus
    metrics: GameMetrics
    score: number
    distance: number
    lane: number // -1, 0, 1
    collectedItems: any[]

    // Actions
    setLane: (lane: number) => void
    collectItem: (item: any) => void
    startGame: () => void
    pauseGame: () => void
    resumeGame: () => void
    endGame: () => void
    resetGame: () => void

    updateMetrics: (delta: Partial<GameMetrics>) => void
    tick: (dt: number) => void // Called every frame to decay stats
}

export const useGameStore = create<GameState>((set) => ({
    status: 'idle',
    metrics: {
        calories: 0,
        hydration: 100,
        energy: 100,
    },
    score: 0,
    distance: 0,
    lane: 0,
    collectedItems: [],

    setLane: (lane: number) => set({ lane }),
    startGame: () => set({ status: 'playing' }),
    pauseGame: () => set({ status: 'paused' }),
    resumeGame: () => set({ status: 'playing' }),
    endGame: () => set({ status: 'ended' }),
    resetGame: () => set({
        status: 'idle',
        metrics: { calories: 0, hydration: 100, energy: 100 },
        score: 0,
        distance: 0,
        lane: 0,
        collectedItems: []
    }),

    collectItem: (item: any) => set((state) => { // Changed item type to 'any' as per GameState interface
        const newMetrics = {
            calories: state.metrics.calories + item.calories,
            hydration: Math.min(100, Math.max(0, state.metrics.hydration + item.hydration)),
            energy: Math.min(100, Math.max(0, state.metrics.energy + item.energy))
        }
        return {
            metrics: newMetrics,
            score: state.score + 100,
            collectedItems: [...state.collectedItems, item]
        }
    }),

    updateMetrics: (delta) => set((state) => {
        const newMetrics = { ...state.metrics, ...delta }
        // Clamp values
        if (newMetrics.hydration > 100) newMetrics.hydration = 100
        if (newMetrics.hydration < 0) newMetrics.hydration = 0
        if (newMetrics.energy > 100) newMetrics.energy = 100
        if (newMetrics.energy < 0) newMetrics.energy = 0

        return { metrics: newMetrics }
    }),

    tick: (dt) => set((state) => {
        if (state.status !== 'playing') return {}

        // Decay rates per second
        const hydrationDecay = 2 * dt
        const energyDecay = 1.5 * dt
        const caloriesBurn = 5 * dt

        // Speed multiplier based on Energy (0.5x to 1.5x)
        const speedMultiplier = 0.5 + (state.metrics.energy / 100)
        const distanceGain = 10 * dt * speedMultiplier

        const newHydration = Math.max(0, state.metrics.hydration - hydrationDecay)
        const newEnergy = Math.max(0, state.metrics.energy - energyDecay)
        const newCalories = state.metrics.calories + caloriesBurn

        // Check for game over conditions
        if (newHydration <= 0 || newEnergy <= 0) {
            return {
                status: 'ended',
                metrics: { ...state.metrics, hydration: newHydration, energy: newEnergy, calories: newCalories }
            }
        }

        return {
            metrics: {
                calories: newCalories,
                hydration: newHydration,
                energy: newEnergy,
            },
            distance: state.distance + distanceGain,
            score: Math.floor(state.distance + distanceGain)
        }
    })
}))
