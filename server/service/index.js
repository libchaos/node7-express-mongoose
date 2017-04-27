module.exports = function (socket) {
  socket.on('message', handleMessage)
  const handleMessage = function (socket) {
    console.log(socket.id);
  }
}