
import { Canvas } from '@react-three/fiber'
import GameScene from '@/components/GameScene'

const Index = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
    >
      <GameScene />
    </Canvas>
  )
}

export default Index;
