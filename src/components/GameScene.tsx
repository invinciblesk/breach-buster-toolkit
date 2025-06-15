
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

const FuturisticShape = (props: JSX.IntrinsicElements['mesh']) => {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2
      ref.current.rotation.y += delta * 0.3
    }
  })
  return (
    <mesh {...props} ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={'#00ffff'} emissive={'#00ffff'} emissiveIntensity={0.3} wireframe />
    </mesh>
  )
}

const GameScene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight color="#00ffff" position={[0, 0, 5]} intensity={150} />
      <FuturisticShape position={[0, 0, 0]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  )
}

export default GameScene;
