import readline from 'readline';
import { io } from 'socket.io-client';
import { addToRolloutMenu } from './controllers/chefController';
import { getRolloutItmes } from './repositories/chefRepository';

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const askQuestion = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

socket.on('connect', async () => {
  console.log('Connected to server');
  const employeeID = await askQuestion('Enter employee ID: ');
  const password = await askQuestion('Enter password: ');
  socket.emit("login",{id:parseInt(employeeID),password})
  
})

socket.on("login", (user) => {
  console.log("Login Successfull")
  console.log(`Welcome ${user.name} to our system`);
  console.log(`Welcome ${user.role} to our system`);

  switch (user.role) {
    case "employee":
      employeeFunction(user);
      break;
    case "admin":
      adminFunction(user)
      break;
    case 'chef':
      chefFunction(user)
      break;

  }

})


socket.on("error", (msg) => {
  console.log(msg)
})
socket.on('message', (msg) => {
  console.log('Message from server: ' + msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

const employeeFunction = async (user: any) => {
  console.log(`Welcome ${user.name}!`);

  // Loop to continue asking for admin actions until explicitly exiting
  while (true) {
    const action = await askQuestion(`
      Choose an action:
      1. View Menu
      2. View notification
      3. Choose item for next day
      Enter action number: `);

    switch (action.trim()) {
      case '1':
        console.log("entering view menu")
        await viewMenu();
        break;
      case '2': 
        socket.emit('getRolloutItems')

      case '3': 
        await chooseItem()

      default:
        console.log('Invalid option');
    }
  }
};

const chooseItem = ()=>{
  
}


const chefFunction = async (user: any) => {
  console.log(`Welcome chef ${user.name}!`);

  // Loop to continue asking for admin actions until explicitly exiting
  while (true) {
    const action = await askQuestion(`
      Choose an action:
      1. View Menu
      2. add rollout item
      3. view rollout item
      Enter action number: `);

    switch (action.trim()) {
      case '1':
        console.log("entering view menu")
        await viewMenu();
        break;
      case '2':
        let category = await askQuestion(`
          Enter category To add to rollout: 
            1> Breakfast
            2> lunch
            3> dinner
          `)
        await rolloutItems(category)
        break;
      case '3':
        socket.emit('getRolloutItems')
        break;
      default:
        console.log('Invalid option');
    }
  }
};

const rolloutItems = async (category) =>{
  
  socket.emit('getRecommendedItems')



  let rollout_item = await askQuestion("Enter id To add to rollout: ")


  socket.emit('createNotification', {category, rolloutItemId: rollout_item} )

  socket.on('createNotificationSuccess', ()=>{
    console.log('Notification sent')
    socket.emit('addRolloutItem', {rolloutItemId:rollout_item})
})
}


const adminFunction = async (user: any) => {
  console.log(`Welcome Admin ${user.name}!`);

  // Loop to continue asking for admin actions until explicitly exiting
  while (true) {
    const action = await askQuestion(`
      Choose an action:
      1. Add Menu
      2. Delete Menu
      3. Update Menu
      4. View Menu
      5. Exit
      Enter action number: `);

    switch (action.trim()) {
      case '1':
        await addMenu();
        break;
      case '2':         
        await deleteMenu();
        break;
      case '3':
        await updateMenu();
        break;
      case '4':
        await viewMenu();
        return;
      case '5':
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

  console.log("Item:", { id: itemID, name: itemName, category: itemCategory, price: itemPrice, availability: itemAvailability })

  socket.emit('addMenu', { id: itemID, name: itemName, category: itemCategory, price: itemPrice, availability: itemAvailability })

  console.log("Item added after emit");

};

// Function to delete an existing menu
const deleteMenu = async () => {
  const menuId = await askQuestion('Enter Menu ID to delete: ');

  socket.emit('deleteMenuItem', { id: parseInt(menuId) });
};

// Function to update an existing menu
const updateMenu = async () => {
  const menuId = await askQuestion('Enter Menu ID to update: ');
  const name = await askQuestion('Enter new name:)');
  const category = await askQuestion('Enter new category:)');
  const price = await askQuestion('Enter new price:)');
  const availability = await askQuestion('Enter new availability:)');

  socket.emit('updateMenu', { id: parseInt(menuId), name, category, price, availability });
};

const viewMenu = async () => {
  socket.emit("viewMenu");
};


socket.on("itemAdded", (menuItem) => {
  console.log("Item added", menuItem)
})


socket.on("getRolloutItemsSuccess", (menuItem) => {
  console.table(menuItem)
})

socket.on("menuItemSuccess", (menuItem) => {
  console.table(menuItem)
})

socket.on('getRecommendedItemsSuccess',  (menuItems: any)=>{
  console.table(menuItems)

})

