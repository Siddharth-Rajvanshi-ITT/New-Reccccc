const handleError = (socket, error, message) => {
    console.error(message, error);
    socket.emit('error', message);
  };
  
  export default handleError;
  