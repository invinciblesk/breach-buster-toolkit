
const GameScene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight color="#00ffff" position={[0, 0, 5]} intensity={150} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  )
}

export default GameScene;
