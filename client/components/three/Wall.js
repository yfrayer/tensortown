import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Constants from 'expo-constants';

function Wall(props) {
  const url = Constants.expoConfig.extra.baseUrl + '/media/';
  const texture = useTexture(url + props.url);
  const width = texture.image.width;
  const height = texture.image.height;
  const scale = props.scale;
  return (
    <sprite scale={[scale*width, scale*height]}>
      <spriteMaterial map={texture}/>
    </sprite>
  );
}

export default Wall;
