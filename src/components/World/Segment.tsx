import { useMemo } from 'react'
import { getRandomFoodItem } from '../../logic/NutritionEngine'
import { Item } from '../Items/Item'

const TRAIL_WIDTH = 10
const SEGMENT_LENGTH = 20
const TREE_COUNT = 5
const ITEM_COUNT = 3

export function Segment({ position, rotation, renderVisuals = true }: { position: [number, number, number], rotation: [number, number, number], index: number, renderVisuals?: boolean }) {
    // Memoize items only
    const { items } = useMemo(() => {
        const foodItems = []
        for (let i = 0; i < ITEM_COUNT; i++) {
            const lane = Math.floor(Math.random() * 3) - 1
            const x = lane * 3.33
            const z = Math.random() * SEGMENT_LENGTH - SEGMENT_LENGTH / 2
            const y = Math.random() > 0.7 ? 2.5 : 1
            foodItems.push({
                item: getRandomFoodItem(),
                position: [x, y, z] as [number, number, number]
            })
        }
        return { items: foodItems }
    }, [])

    return (
        <group position={position} rotation={rotation}>
            {/* Ground - Much Wider for infinite look */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[200, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#2d4c1e" />
            </mesh>

            {/* Trail Path */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <planeGeometry args={[TRAIL_WIDTH, SEGMENT_LENGTH]} />
                <meshStandardMaterial color="#8b5a2b" />
            </mesh>

            {/* Items */}
            {items.map((data, i) => (
                <Item key={`item-${i}`} item={data.item} position={data.position} />
            ))}
        </group>
    )
}
