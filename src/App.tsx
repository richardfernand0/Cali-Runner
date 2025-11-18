import { Canvas } from '@react-three/fiber'
import { GameManager } from './components/GameManager'
import { Scene } from './components/Scene'
import { Track } from './components/World/Track'
import { Character } from './components/Player/Character'
import { CameraFollow } from './components/CameraFollow'

import { HUD } from './components/UI/HUD'

function App() {
  return (
    <div className="w-full h-full relative">
      <HUD />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
        <Track />
        <Character />
        <GameManager />
        <CameraFollow />
      </Canvas>
    </div>
  )
}

export default App
