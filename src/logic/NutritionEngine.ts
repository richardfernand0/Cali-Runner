export interface FoodItem {
    id: string
    name: string
    type: 'food' | 'drink'
    calories: number
    hydration: number
    energy: number
    color: string
    model?: string // Placeholder for future 3D model
}

export const FOOD_ITEMS: FoodItem[] = [
    {
        id: 'banana',
        name: 'Banana',
        type: 'food',
        calories: 105,
        hydration: 0,
        energy: 15,
        color: '#FFE135'
    },
    {
        id: 'water',
        name: 'Water Bottle',
        type: 'drink',
        calories: 0,
        hydration: 30,
        energy: 5,
        color: '#00BFFF'
    },
    {
        id: 'soda',
        name: 'Soda',
        type: 'drink',
        calories: 150,
        hydration: -10, // Dehydrates
        energy: 40, // High energy spike
        color: '#FF4500'
    },
    {
        id: 'apple',
        name: 'Apple',
        type: 'food',
        calories: 95,
        hydration: 5,
        energy: 10,
        color: '#FF0000'
    },
    {
        id: 'coconut',
        name: 'Coconut Water',
        type: 'drink',
        calories: 45,
        hydration: 40,
        energy: 10,
        color: '#F0F8FF'
    }
]

export function getRandomFoodItem(): FoodItem {
    return FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)]
}
