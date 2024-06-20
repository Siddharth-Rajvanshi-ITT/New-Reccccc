import readline from 'readline';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const askQuestion = (query:string):Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

socket.on('connect', async () => {
  console.log('Connected to server');
  const employeeID = await askQuestion('Enter employee ID: ');
  const password = await askQuestion('Enter password: ');
  socket.emit("login",{id:parseInt(employeeID),password})
});

socket.on("login",(user)=>{
  console.log("Login Successfull")
  console.log(`Welcome ${user.name} to our system`);
  console.log(`Welcome ${user.role} to our system`);

  switch (user.role){
    // case "employee":
    //   employeeFunction(user);
    //   break;
    case "admin":
      adminFunction(user)
      break;
    
  }

})




socket.on("error",(msg)=>{
  console.log(msg)
})
socket.on('message', (msg) => {
  console.log('Message from server: ' + msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});



const adminFunction = async (user: any) => {
  console.log(`Welcome Admin ${user.name}!`);

  // Loop to continue asking for admin actions until explicitly exiting
  while (true) {
    const action = await askQuestion(`
      Choose an action:
      1. Add Menu
      2. Delete Menu
      3. Update Menu
      4. Exit
      Enter action number: `);

    switch (action.trim()) {
      case '1': // Add Menu
        await addMenu();
        break;
      case '2': // Delete Menu
        await deleteMenu();
        break;
      case '3': // Update Menu
        await updateMenu();
        break;
      case '4': // Exit
        console.log('Exiting Admin Panel');
        return;
      default:
        console.log('Invalid option');
    }
  }
};

// Function to add a new menu
const addMenu = async () => {
  const itemID = await askQuestion('Enter Menu ID: ');
  const itemName = await askQuestion('Enter Menu Name: ');
  const itemCategory = await askQuestion('Enter Menu Category: ');
  const itemPrice = await askQuestion('Enter Menu Price : ');
  const itemAvailability = await askQuestion('Enter Menu Availability Status: ');

  console.log("Item:", { id:itemID , name: itemName, category: itemCategory, price: itemPrice, availability: itemAvailability })

  socket.emit('addMenu', { id:itemID , name: itemName, category: itemCategory, price: itemPrice, availability: itemAvailability })
  
  console.log("Item added after emit");
};

// Function to delete an existing menu
const deleteMenu = async () => {
  const menuId = await askQuestion('Enter Menu ID to delete: ');

  socket.emit('deleteMenu', { id: parseInt(menuId) });
};

// Function to update an existing menu
const updateMenu = async () => {
  const menuId = await askQuestion('Enter Menu ID to update: ');
  const menuName = await askQuestion('Enter Updated Menu Name: ');
  const menuType = await askQuestion('Enter Updated Menu Type: ');

  socket.emit('updateMenu', { id: parseInt(menuId), name: menuName, type: menuType });
};

// Event listeners for server responses and socket events
socket.on('connect', async () => {
  console.log('Connected to server');
  const employeeID = await askQuestion('Enter employee ID: ');
  const password = await askQuestion('Enter password: ');
  socket.emit("login", { id: parseInt(employeeID), password });
});

socket.on("itemAdded",(menuItem)=>{
  console.log("Item added", menuItem)
})
