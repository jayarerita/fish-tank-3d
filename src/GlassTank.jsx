import React, {Fragment, useMemo, useRef} from 'react'
import { Extrude, MeshTransmissionMaterial, useTexture} from '@react-three/drei';
import {Shape, BoxGeometry} from 'three';
import { useFrame, useThree, useLoader, extend } from '@react-three/fiber';
import { MeshPhysicalMaterial, TextureLoader, PlaneGeometry, Vector3, RepeatWrapping } from 'three';
import { Water } from 'three-stdlib';

extend({Water})

function Gravel(props) {

  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap, metalnessMap] = useTexture([
    "clean_pebbles__color_1k.jpg",
    "clean_pebbles__disp_1k.jpg",
    "clean_pebbles__nor_1k.jpg",
    "clean_pebbles__rough_1k.jpg",
    "clean_pebbles__ao_1k.jpg",
    "clean_pebbles__metal_1k.jpg",
  ]);

  return (
    <>
    </>
  )
}

function Ocean(props) {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(TextureLoader, '/waternormals.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping
  const geom = useMemo(() => new BoxGeometry(props.width || 10, props.length || 10, 0.01), [])
  const config = useMemo(
    () => ({
      textureWidth: 100,
      textureHeight: 5,
      waterNormals,
      sunDirection: new Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 10,
      fog: false,
      format: gl.encoding
    }),
    [waterNormals]
  )
  useFrame((state, delta) => (
    ref.current.material.uniforms.time.value = ref.current.material.uniforms.time.value + delta/5
    ))
  return (
  <water
    ref={ref}
    args={[geom, config]}
    rotation-x={Math.PI}
    position={props.position}
    />
  )
}

function GlassTank(props) {   
  
  const tankMaterial = new MeshPhysicalMaterial({
    color: props.color,
    transmission: 1,
    roughness: 0.01,
    thickness: .1,
    envMapIntensity: 4,
  })

  const front_side = useMemo(() => {
      const _shape = new Shape()

      const width = props.width; // total width
      const thickness = props.thickness; // thickness of the walls
      // 
      _shape.moveTo(0,0);
      _shape.lineTo(width,0);
      _shape.lineTo(width, thickness);
      _shape.lineTo(0, thickness);
      _shape.lineTo(0, 0);

      return _shape;
  }, [])

  const back_side = useMemo(() => {
    const _shape = new Shape()

    const width = props.width; // total width
    const depth = props.depth; // total length
    const thickness = props.thickness; // thickness of the walls
    // 
    _shape.moveTo(0,depth);
    _shape.lineTo(width,depth);
    _shape.lineTo(width, depth - thickness);
    _shape.lineTo(0, depth - thickness);
    _shape.lineTo(0, depth);

    return _shape;
  }, [])

  const left_side = useMemo(() => {
    const _shape = new Shape()

    const depth = props.depth; // total length
    const thickness = props.thickness; // thickness of the walls
    // 
    _shape.moveTo(0,thickness);
    _shape.lineTo(thickness,thickness);
    _shape.lineTo(thickness, depth - thickness);
    _shape.lineTo(0, depth - thickness);
    _shape.lineTo(0, thickness);

    return _shape;
  }, [])

  const right_side = useMemo(() => {
    const _shape = new Shape()

    const width = props.width; // total width
    const depth = props.depth; // total length
    const thickness = props.thickness; // thickness of the walls
    // 
    _shape.moveTo(width - thickness,thickness);
    _shape.lineTo(width,thickness);
    _shape.lineTo(width, depth - thickness);
    _shape.lineTo(width - thickness, depth - thickness);
    _shape.lineTo(width - thickness, thickness);

    return _shape;
  }, [])

  const bottom_side = useMemo(() => {
    const _shape = new Shape()
    const width = props.width; // total width
    const depth = props.depth; // total length
    //
    _shape.moveTo(0,0);
    _shape.lineTo(width,0);
    _shape.lineTo(width, depth);
    _shape.lineTo(0, depth);
    _shape.lineTo(0, 0);
    
    return _shape;
  }, [])

  const extrudeSettingsSides = useMemo(() => ({
      steps: 1,
      depth: props.height,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1,
  }),[]);

  const extrudeSettingsBottom = useMemo(() => ({
    steps: 1,
    depth: props.thickness,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1,
}),[]);
  return (
    <Fragment>
      <group rotation={props.rotation} position={props.position}>
      <Extrude
        args={[front_side, extrudeSettingsSides]}
        position={[0,0,props.thickness]}
        //material={tankMaterial}
        castShadow
        >
        <MeshTransmissionMaterial backside backsideThickness={0} thickness={0}  />
      </Extrude>

      <Extrude
        args={[back_side, extrudeSettingsSides]}
        position={[0,0,props.thickness]}
        //material={tankMaterial}
        castShadow
        >
        <MeshTransmissionMaterial backside backsideThickness={0} thickness={0}  />

      </Extrude>
      <Extrude
        args={[left_side, extrudeSettingsSides]}
        position={[0,0,props.thickness]}
        //material={tankMaterial}
        castShadow
        >
        <MeshTransmissionMaterial backside backsideThickness={0} thickness={0}  />
      </Extrude>
      <Extrude
        args={[right_side, extrudeSettingsSides]}
        position={[0,0,props.thickness]}
        //material={tankMaterial}
        castShadow
        >
        <MeshTransmissionMaterial backside backsideThickness={0} thickness={0}  />
      </Extrude>
      <Extrude
        args={[bottom_side, extrudeSettingsBottom]}
        position={[0,0,0]}
        //material={tankMaterial}
        castShadow
        >
        <MeshTransmissionMaterial backside backsideThickness={0} thickness={0}  />
      </Extrude>
      <Ocean 
        position={[props.width/2,props.depth/2,props.height-2*props.thickness]}
        width={props.width - 2*props.thickness}
        length={props.depth - 2*props.thickness}
        />
      </group>
    </Fragment>

  )
}

GlassTank.defaultProps = {
    color: "#56a0d3",
    width: 10,
    depth: 10,
    height: 10,
    thickness: 1,
    position: [0,0,0],
}

export default GlassTank