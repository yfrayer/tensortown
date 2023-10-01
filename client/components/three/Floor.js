import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Constants from 'expo-constants';
import socket from 'utils/socket';

function Floor(props) {
  //based on avatar
  const heightOffset = 1.7/2;
  const url = Constants.expoConfig.extra.baseUrl + '/media/';
  const texture = useTexture(url + props.url);
  const width = texture.image.width;
  const height = texture.image.height;
  const scale = props.scale;
  return (
    <sprite
      onClick={(event) => {
        const position = event.point;
        const point = [
          event.point.x, event.point.y + heightOffset, event.point.z
        ];
        socket.emit('playerMove', point);
      }}
      rotation={[-1,0,0]}
      position={[0,-3.5,0]}
      scale={[scale*width, scale*height]}
    >
      <spriteMaterial map={texture}/>
    </sprite>
  );
}

export default Floor;
