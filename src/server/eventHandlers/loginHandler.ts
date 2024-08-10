import { getUser } from '../controllers/userController';
import handleError from '../socketHandlers/errorHandler';

const handleLogin = async (socket, { id, password }) => {
  try {
    const user = await getUser(id, password);
    user ? socket.emit('login', user) : socket.emit('error', 'Invalid Credentials');
  } catch (error) {
    handleError(socket, error, 'Invalid Credentials');
  }
};

export default handleLogin;
