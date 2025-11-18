import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { FOOD_ITEMS } from '../../logic/NutritionEngine'

export function HUD() {
    const metrics = useGameStore((state) => state.metrics)
    const score = useGameStore((state) => state.score)
    const status = useGameStore((state) => state.status)
    const startGame = useGameStore((state) => state.startGame)
    const resetGame = useGameStore((state) => state.resetGame)

    const collectedItems = useGameStore((state) => state.collectedItems)

    if (status === 'ended') {
        return (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white p-8 overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 text-red-500">Run Ended</h1>

                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mb-8">
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <h2 className="text-xl font-bold mb-2 text-gray-400">Final Stats</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Score:</span> <span className="font-mono text-yellow-400">{score}</span></div>
                            <div className="flex justify-between"><span>Distance:</span> <span className="font-mono text-blue-400">{Math.floor(metrics.calories * 2)}m</span></div>
                            <div className="flex justify-between"><span>Calories Burned:</span> <span className="font-mono text-orange-400">{Math.round(metrics.calories)}</span></div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl">
                        <h2 className="text-xl font-bold mb-2 text-gray-400">Nutrition Breakdown</h2>
                        <div className="text-sm text-gray-300 mb-2">
                            You collected <span className="text-white font-bold">{collectedItems.length}</span> items.
                        </div>
                        <div className="h-32 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                            {collectedItems.map((item, i) => (
                                <div key={i} className="flex justify-between text-xs bg-gray-700 p-1 rounded">
                                    <span>{item.name}</span>
                                    <span className={item.calories > 100 ? 'text-red-300' : 'text-green-300'}>
                                        {item.calories > 0 ? `+${item.calories} cal` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl mb-8">
                    <h2 className="text-xl font-bold mb-4 text-green-400">Nutrition Insights</h2>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                        {metrics.hydration <= 0 && <li className="text-red-400">You collapsed from dehydration! Drink more water next time.</li>}
                        {metrics.energy <= 0 && <li className="text-yellow-400">You ran out of energy! Eat healthy carbs like Bananas for sustained power.</li>}
                        {collectedItems.some(i => i.id === 'soda') && <li>Soda gave you a quick boost but dehydrated you. Watch out for sugar crashes!</li>}
                        {collectedItems.some(i => i.id === 'water' || i.id === 'coconut') && <li className="text-blue-300">Good job staying hydrated with Water and Coconut Water!</li>}
                    </ul>
                </div>

                <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-green-500 rounded-xl font-bold text-xl hover:bg-green-600 transition transform hover:scale-105 shadow-lg shadow-green-500/20"
                >
                    Run Again
                </button>
            </div>
        )
    }

    const [showEncyclopedia, setShowEncyclopedia] = useState(false)

    if (showEncyclopedia) {
        return (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 text-white p-8">
                <h1 className="text-4xl font-bold mb-8 text-green-400">Food Encyclopedia</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl overflow-y-auto max-h-[60vh]">
                    {FOOD_ITEMS.map(item => (
                        <div key={item.id} className="bg-gray-800 p-4 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: item.color }} />
                            <div>
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <div className="text-xs text-gray-400 flex gap-2">
                                    <span>Cal: {item.calories}</span>
                                    <span>Hyd: {item.hydration}</span>
                                    <span>Eng: {item.energy}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">
                                    {item.type === 'drink' ? 'Hydrating beverage.' : 'Solid food source.'}
                                    {item.calories > 100 ? ' High calorie!' : ''}
                                    {item.hydration < 0 ? ' Dehydrating!' : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setShowEncyclopedia(false)}
                    className="mt-8 px-6 py-3 bg-gray-600 rounded-lg font-bold hover:bg-gray-500 transition"
                >
                    Back to Menu
                </button>
            </div>
        )
    }

    if (status === 'idle') {
        return (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 text-white">
                <h1 className="text-6xl font-bold mb-8 text-green-400">Nutrition Runner</h1>
                <p className="mb-8 text-xl max-w-md text-center">
                    Run as far as you can! Collect healthy food to maintain Energy and Hydration.
                    Avoid junk food spikes!
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-green-500 rounded-xl font-bold text-2xl hover:bg-green-600 transition transform hover:scale-105"
                    >
                        Start Run
                    </button>
                    <button
                        onClick={() => setShowEncyclopedia(true)}
                        className="px-8 py-4 bg-blue-500 rounded-xl font-bold text-2xl hover:bg-blue-600 transition transform hover:scale-105"
                    >
                        Encyclopedia
                    </button>
                </div>
            </div>
        )
    }

    // Visual Effects
    const blurAmount = Math.max(0, (30 - metrics.hydration) / 5) // Start blurring at < 30%

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            {/* Blur Overlay */}
            <div
                className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                style={{
                    backdropFilter: `blur(${blurAmount}px)`,
                    opacity: blurAmount > 0 ? 1 : 0
                }}
            />

            <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2 w-64">
                        {/* Energy Bar */}
                        <div className="bg-gray-800/80 p-2 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between text-xs text-white mb-1">
                                <span>Energy</span>
                                <span>{Math.round(metrics.energy)}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all duration-300"
                                    style={{ width: `${metrics.energy}%` }}
                                />
                            </div>
                        </div>

                        {/* Hydration Bar */}
                        <div className="bg-gray-800/80 p-2 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between text-xs text-white mb-1">
                                <span>Hydration</span>
                                <span>{Math.round(metrics.hydration)}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400 transition-all duration-300"
                                    style={{ width: `${metrics.hydration}%` }}
                                />
                            </div>
                        </div>

                        {/* Calories */}
                        <div className="bg-gray-800/80 p-2 rounded-lg backdrop-blur-sm text-white">
                            <div className="text-xs text-gray-300">Calories Burned</div>
                            <div className="text-xl font-bold text-orange-400">{Math.round(metrics.calories)} kcal</div>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="bg-gray-800/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <div className="text-3xl font-bold text-white font-mono">{score.toString().padStart(6, '0')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
