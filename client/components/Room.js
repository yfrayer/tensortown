import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text } from "@react-three/drei";
import { Vector3 } from 'three';
import Wall from 'components/three/Wall';
import Floor from 'components/three/Floor';
import Avatar from 'components/three/Avatar';
import socket from 'utils/socket';

function Room() {
  const [avatarPos, setAvatarPos] = useState(new Vector3(0, -1.5, 0));
  const [avatars, setAvatars] = useState([
    //default avatar
    { id: 1, username: 'guest', loggedIn: false,
      position: avatarPos, avatar: 'phoenix', facingRight: true
    },
  ]);
  useEffect(() => {
    const onUserEnter = (data) => {
      if (!data.position.x) {
      data.position = new Vector3(
        data.position[0],
        data.position[1],
        data.position[2],
      );
      }
      setAvatars(prev => [...prev, data]);
    };
    const onUserLeave = (data) => {
      setAvatars(prev => prev.filter(i => i.id !== data));
    };
    const onSetPlayers = (data) => {
      for (let i in data) {
        data[i].position = new Vector3(
          data[i].position[0],
          data[i].position[1],
          data[i].position[2],
        );
      }
      setAvatars(data);
    };
    socket.on('userEnter', onUserEnter);
    socket.on('userLeave', onUserLeave);
    socket.on('setPlayers', onSetPlayers);
    return () => {
      socket.off('userEnter', onUserEnter);
      socket.off('userLeave', onUserLeave);
      socket.off('setPlayers', onSetPlayers);
    };
  }, []);
  return (
    <Canvas dpr={[2, 3]}>
      <ambientLight color='white'/>
      <directionalLight color='white' position={[1,-1,0]}/>
      <Wall url='scribbleroom2.png' scale={.019}/>
      <Floor url='floor.png'
        avatarPos={avatarPos}
        setAvatarPos={setAvatarPos}
        scale={.019}
      />
      { avatars?.map(({
        id, username, loggedIn, position, avatar, facingRight
      }) => {
        return <Avatar
          key={id}
          id={id}
          url={avatar}
          facingRight={facingRight}
          position={position}
          username={username}
        />
      })}
    </Canvas>
  );
}

export default Room;
