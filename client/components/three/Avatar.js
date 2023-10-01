import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import { Vector3, FileLoader, DoubleSide, Clock, sRGBEncoding } from 'three';
import Constants from 'expo-constants';
import socket from 'utils/socket';

export default function Avatar(props) {
  const mesh = useRef();
  const group = useRef();

  //initial animation state
  const animation = useRef('idle');
  const currentFrame = useRef(0);
  const direction = useRef(1);
  const init = useRef(true);
  let initialDirection = 1;
  if (props.facingRight) {
    initialDirection = initialDirection * -1;
  }

  const clock = new Clock();
  const frameRateWalk = 1/10;
  const frameRateIdle = 1;

  const newPos = useRef(null);
  const velocity = useRef(new Vector3(0, 0, 0));
  const fpsInverse = 1/60;

  const url = Constants.expoConfig.extra.baseUrl + '/media/';
  const data = JSON.parse(useLoader(FileLoader, url + props.url + '.json'));
  const frames = data.frames;
  const animations = data.animations;

  const parseSpritesheet = () => {
    const spritesheet = useTexture(url + props.url + '.png');
    const width = spritesheet.image.width;
    const height = spritesheet.image.height;
    const textures = {};

    for (const frameName in frames) {
      const frame = frames[frameName];
      const { x, y, w, h } = frame.frame;
      const texture = spritesheet.clone();
      texture.repeat.set(w/width, h/height);
      texture.offset.set(x/width, 1 - (y + h)/height);
      texture.encoding = sRGBEncoding;
      textures[frameName] = texture;
      textures[frameName].scale = [.01 * w, .01 * h];
      textures[frameName].position = -1*.01*(y+h)/height;
    }
    return textures;
  }

  const textures = parseSpritesheet();

  useEffect(() => {
    const groupPos = group.current.position;
    const onMovePlayer = (data) => {
      console.log(props.id);
      if (data.id == props.id) {
        let point = data.point;
        const newPosVector = new Vector3(point[0], point[1], point[2]);
        const distance = newPosVector.clone().sub(groupPos);
        velocity.current = distance.multiplyScalar(fpsInverse);
        newPos.current = newPosVector;
      }
    };
    socket.on('movePlayer', onMovePlayer);
    return () => {
      socket.off('movePlayer', onMovePlayer);
    };
  }, []);

  useFrame(() => {
    const time = clock.getElapsedTime();
    let frame = currentFrame.current;
    let animState = animation.current;
    const groupX = group.current.position.x;
    if (newPos.current) {
      if (animation.current == 'idle') {
        animation.current = 'walk';
        animState = 'walk';
        frame = 0;
        currentFrame.current = 0;
        init.current = true;
      }
      if (groupX < newPos.current.x) {
        if (direction.current == 1) {
          direction.current = -1;
        }
      } else {
        if (direction.current == -1) {
          direction.current = 1;
        }
      }
      group.current.position.add(velocity.current);
      if (group.current.position.distanceTo(newPos.current) < .1) {
        newPos.current = null;
        animation.current = 'idle';
        animState = 'idle';
        frame = 0;
        currentFrame.current = 0;
        init.current = true;
      }
    }
    if (!init.current) {
      if (animation.current == 'idle') {
        if (time < frameRateIdle) { return; }
      } else if (animation.current == 'walk') {
        if (time < frameRateWalk) { return; }
      }
    }
    mesh.current.material.map = textures[animations[animState][frame]];
    mesh.current.scale.x = direction.current
      * textures[animations[animState][frame]].scale[0];
    mesh.current.scale.y = textures[animations[animState][frame]].scale[1];
    mesh.current.position.y = textures[animations[animState][frame]].position;
    currentFrame.current = (frame + 1) % animations[animState].length;
    init.current = false;
    clock.start();
  });

  return (
    <group
      ref={group}
      position={props.position}
    >
      <Text fontSize={.25} position={[0,1.25,0]} color='black'>
        {props.username}
      </Text>
      <mesh
        ref={mesh}
        scale={[
          textures[animations['idle'][0]].scale[0]*initialDirection,
          textures[animations['idle'][0]].scale[1],
          1
        ]}
        position={[
          0,
          textures[animations['idle'][0]].position,
          0
        ]}
      >
        <planeGeometry
          args={[1, 1]}
        />
        <meshStandardMaterial
          map={textures[animations['idle'][0]]}
          side={DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}
