function random() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}

let players = [];

module.exports.set = function(io) {
  io.on('connection', (socket) => {
    let id = socket.id;
    let username;
    let loggedIn = false;
    let position = [ 0, -1.5, 0 ];
    let avatar = 'phoenix';
    let facingRight = true;
    if (socket.request.session.passport
      && socket.request.session.passport.user
      && socket.request.session.passport.user.username)
    {
      username = socket.request.session.passport.user.username;
      loggedIn = true;
    } else {
      username = 'guest' + random();
    }
    let player = {
      id: id,
      username: username,
      loggedIn: loggedIn,
      position: position,
      avatar: avatar,
      facingRight: facingRight,
    };
    players = [...players, player];
    console.log('a user connected');
    socket.join('days');
    socket.to('days').emit('userEnter', player);
    socket.on('disconnect', () => {
      disconnect();
    });
    socket.on('forceDisconnect', () => {
      disconnect();
    });
    socket.on('sendMessage', (data) => {
      let msgId = random();
      msg = { id: msgId, content: data.content, author: data.author }
      socket.nsp.to('days').emit('receiveMessage', msg);
    });
    socket.on('getUser', () => {
      socket.emit('setUser', player);
    });
    socket.on('getPlayers', () => {
      socket.emit('setPlayers', players);
    });
    socket.on('playerMove', (data) => {
      let moveData = {};
      moveData.id = id;
      moveData.point = data;
      const movedPlayer = players.findIndex(item => item.id == id);
      console.log(players[movedPlayer].position[0]);
      console.log(data[0]);
      if (players[movedPlayer].position[0] < data[0]) {
        players[movedPlayer].facingRight = true;
      } else {
        players[movedPlayer].facingRight = false;
      }
      players[movedPlayer].position = data;
      console.log(players);
      socket.nsp.to('days').emit('movePlayer', moveData);
    });
    const disconnect = () => {
      socket.disconnect();
      console.log('a user disconnected');
      let index = players.findIndex(i => i.id === id);
      players.splice(index, 1);
      socket.to('days').emit('userLeave', id);
    };
  });
}
