const _ = require('lodash');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

const serve = app.listen(app.get('port'), () => {
  console.log('serve on port', app.get('port'));
});

const SocketIO = require('socket.io');
const io = SocketIO(serve);

const user = [];

io.on('connection', (socket) => {
  socket.on('user:ws', (data) => {
    const userFind = _.find(user, {'email': data.email});
    if(!userFind) {
      user.push(data);
    }
    io.sockets.emit('users:ws', user);
  });
  
  
  socket.on('encuentro:ws', (data) => {
    console.log(data);
    const my = _.find(user,{'email': data.user});
    console.log(my);
    my.encuentros.push(data.email);
  });

  socket.on('sick:ws', (data) => {
    const my = _.find(user,{'email': data.user});
    my.sick = data.sick;
    my.encuentros.forEach(email => {
      const userFinded = _.find(user,{'email': email});
      userFinded.sick = data.sick;
    });
    io.sockets.emit('users:ws', user);
  });
});