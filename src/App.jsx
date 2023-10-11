import * as THREE from 'three'
import { Fragment, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Environment, Loader, OrbitControls} from '@react-three/drei'
import GlassTank from './GlassTank'

function Sphere(props) {
  return (
    <mesh castShadow {...props} renderOrder={-2000000}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="green" roughness={1} />
    </mesh>
  )
}

function Spheres() {
  const group = useRef()
  useFrame((state) => {
    group.current.children[0].position.y = THREE.MathUtils.lerp(
      group.current.children[0].position.y,
      10 - state.mouse.x * 3,
      0.02
    )
    group.current.children[1].position.y = THREE.MathUtils.lerp(
      group.current.children[1].position.y,
      14 - state.mouse.x * 10,
      0.01
    )
  })
  return (
    <group ref={group}>
      <Sphere position={[10, 30, -12]} scale={2} />
      <Sphere position={[20, 30, -4]} scale={3} />
    </group>
  )
}


export default function App() {
  return (
    <div className="h-screen w-screen">
    <Fragment>
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 0, 100], fov: 22 }}
        
        >
        <fog attach="fog" args={['#f0f0f0', 100, 150]} />
        <color attach="background" args={['#f0f0f0']} />
        <spotLight
          penumbra={1}
          angle={1}
          castShadow
          position={[10, 60, -5]}
          intensity={8}
          shadow-mapSize={[512, 512]}
        />
        <Suspense fallback={null}>
          <group position={[0, -12, 0]}>
            <GlassTank
              position={[0,2,0]}
              height={20}
              width={40}
              depth={30}
              thickness={0.5}
              rotation={[-Math.PI/2, 0, 0]}
              color="#8f8f8f"
          />
          <Spheres />
            <mesh
              rotation-x={-Math.PI / 2}
              position={[0, 0.01, 0]}
              scale={[200, 200, 200]}
              receiveShadow
              renderOrder={100000}>
              <planeGeometry />
              <shadowMaterial transparent color="#251005" opacity={0.25} />
            </mesh>
          </group>
          <hemisphereLight intensity={0.2} />
          <ambientLight intensity={0.5} />
          <Environment preset="warehouse" />
          <Text
            position={[-20, -2.5, -30]}
            letterSpacing={-0.05}
            font="/Poppins-Medium.ttf"
            fontSize={10}
            color="gray"
            material-toneMapped={false}
            material-fog={false}
            anchorX="center"
            anchorY="middle">
            {`fishies`}
          </Text>
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.1} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <Loader />
    </Fragment>
    </div>
  )
}
