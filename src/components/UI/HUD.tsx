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
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white p-8 overflow-y-auto">
                <div className="bg-gray-900/90 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-4xl w-full backdrop-blur-md">
                    <h1 className="text-5xl font-black mb-8 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight">Run Ended</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                            <h2 className="text-xl font-bold mb-4 text-gray-400 uppercase tracking-wider">Final Stats</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Score</span>
                                    <span className="text-3xl font-mono font-bold text-yellow-400">{score}</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Distance</span>
                                    <span className="text-3xl font-mono font-bold text-blue-400">{Math.floor(metrics.calories * 2)}m</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Calories</span>
                                    <span className="text-3xl font-mono font-bold text-orange-400">{Math.round(metrics.calories)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-gray-400 uppercase tracking-wider">Nutrition Breakdown</h2>
                            <div className="text-sm text-gray-400 mb-3">
                                Collected <span className="text-white font-bold">{collectedItems.length}</span> items
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent max-h-48">
                                {collectedItems.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded-lg border border-white/5">
                                        <span className="font-medium flex items-center gap-2">
                                            <span className="text-lg">{item.emoji}</span>
                                            {item.name}
                                        </span>
                                        <span className={`font-bold ${item.calories > 100 ? 'text-red-400' : 'text-green-400'}`}>
                                            {item.calories > 0 ? `+${item.calories}` : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-white/5 mb-8">
                        <h2 className="text-xl font-bold mb-4 text-green-400 uppercase tracking-wider flex items-center gap-2">
                            <span>💡</span> Nutrition Insights
                        </h2>
                        <ul className="space-y-3 text-sm text-gray-300">
                            {metrics.hydration <= 0 && <li className="flex gap-2 items-start"><span className="text-red-500">⚠️</span> <span>You collapsed from <strong className="text-white">dehydration</strong>! Drink more water next time.</span></li>}
                            {metrics.energy <= 0 && <li className="flex gap-2 items-start"><span className="text-yellow-500">⚠️</span> <span>You ran out of <strong className="text-white">energy</strong>! Eat healthy carbs like Bananas for sustained power.</span></li>}
                            {collectedItems.some(i => i.id === 'soda') && <li className="flex gap-2 items-start"><span>🥤</span> <span>Soda gave you a quick boost but dehydrated you. Watch out for sugar crashes!</span></li>}
                            {collectedItems.some(i => i.id === 'water' || i.id === 'coconut') && <li className="flex gap-2 items-start"><span>💧</span> <span className="text-blue-300">Good job staying hydrated with Water and Coconut Water!</span></li>}
                            {collectedItems.length === 0 && <li className="flex gap-2 items-start"><span>🍽️</span> <span>Try to collect food items to stay alive longer!</span></li>}
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={resetGame}
                            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl font-black text-xl text-white hover:from-green-400 hover:to-green-500 transition transform hover:scale-105 shadow-xl shadow-green-900/50 border border-green-400/20 uppercase tracking-wide"
                        >
                            Run Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const [showEncyclopedia, setShowEncyclopedia] = useState(false)

    if (showEncyclopedia) {
        return (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md text-white p-8">
                <div className="w-full max-w-6xl h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 uppercase tracking-tight">Food Encyclopedia</h1>
                        <button
                            onClick={() => setShowEncyclopedia(false)}
                            className="px-6 py-2 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition border border-white/10"
                        >
                            CLOSE
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                        {FOOD_ITEMS.map(item => (
                            <div key={item.id} className="bg-gray-800/50 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition group backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-4xl transform group-hover:scale-110 transition bg-white/10 backdrop-blur-md border border-white/10">
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-white group-hover:text-green-400 transition">{item.name}</h3>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-gray-300 uppercase tracking-wider">{item.type}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-black/30 p-2 rounded-lg text-center">
                                        <div className="text-xs text-gray-500 uppercase font-bold">Cal</div>
                                        <div className={`font-mono font-bold ${item.calories > 100 ? 'text-red-400' : 'text-green-400'}`}>{item.calories}</div>
                                    </div>
                                    <div className="bg-black/30 p-2 rounded-lg text-center">
                                        <div className="text-xs text-gray-500 uppercase font-bold">Hyd</div>
                                        <div className={`font-mono font-bold ${item.hydration < 0 ? 'text-red-400' : 'text-blue-400'}`}>{item.hydration}</div>
                                    </div>
                                    <div className="bg-black/30 p-2 rounded-lg text-center">
                                        <div className="text-xs text-gray-500 uppercase font-bold">Eng</div>
                                        <div className="font-mono font-bold text-yellow-400">{item.energy}</div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {item.type === 'drink' ? 'Hydrating beverage.' : 'Solid food source.'}
                                    {item.calories > 100 ? ' High calorie content, watch out!' : ''}
                                    {item.hydration < 0 ? ' Causes dehydration!' : ''}
                                    {item.energy > 20 ? ' Great energy boost!' : ''}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
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
                <div className="flex gap-6">
                    <button
                        onClick={startGame}
                        className="px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl font-black text-2xl text-white hover:from-green-400 hover:to-green-500 transition transform hover:scale-105 shadow-xl shadow-green-900/50 border border-green-400/20"
                    >
                        START RUN
                    </button>
                    <button
                        onClick={() => setShowEncyclopedia(true)}
                        className="px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl font-black text-2xl text-white hover:from-blue-400 hover:to-blue-500 transition transform hover:scale-105 shadow-xl shadow-blue-900/50 border border-blue-400/20"
                    >
                        ENCYCLOPEDIA
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

            <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none">
                <div className="flex justify-between items-start max-w-7xl mx-auto">
                    <div className="flex flex-col gap-3 w-72">
                        {/* Energy Bar */}
                        <div className="bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                            <div className="flex justify-between text-xs font-bold text-white mb-1 uppercase tracking-wider">
                                <span>Energy</span>
                                <span>{Math.round(metrics.energy)}%</span>
                            </div>
                            <div className="w-full h-4 bg-gray-900/50 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
                                    style={{ width: `${metrics.energy}%` }}
                                />
                            </div>
                        </div>

                        {/* Hydration Bar */}
                        <div className="bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                            <div className="flex justify-between text-xs font-bold text-white mb-1 uppercase tracking-wider">
                                <span>Hydration</span>
                                <span>{Math.round(metrics.hydration)}%</span>
                            </div>
                            <div className="w-full h-4 bg-gray-900/50 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                                    style={{ width: `${metrics.hydration}%` }}
                                />
                            </div>
                        </div>

                        {/* Calories */}
                        <div className="bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg flex justify-between items-center">
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">Burned</div>
                            <div className="text-xl font-black text-orange-400">{Math.round(metrics.calories)} <span className="text-xs font-normal text-gray-400">kcal</span></div>
                        </div>

                        {/* Calories Collected */}
                        <div className="bg-black/40 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg flex justify-between items-center">
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">Collected</div>
                            <div className="text-xl font-black text-green-400">+{metrics.caloriesCollected || 0} <span className="text-xs font-normal text-gray-400">kcal</span></div>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="bg-black/40 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-1">Distance</div>
                        <div className="text-4xl font-black text-white font-mono tracking-tight">{score.toString().padStart(6, '0')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
