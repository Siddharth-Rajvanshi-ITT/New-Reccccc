import { askQuestion } from '../utils/inputUtils';
import { SocketController } from './socketController';

export class EmployeeController {
    private socketController: SocketController;

    constructor(socketController: SocketController) {
        this.socketController = socketController;
    }

    public async handleUser(user: any) {
        console.log(`Welcome ${user.name}!`);

        let exit = false;
        while (!exit) {
            const action = await askQuestion(`
        Choose an action:
        1. View Menu
        2. View notification
        3. Choose item for next day
        4. Exit
        Enter action number: `);

            switch (action.trim()) {
                case '1':
                    console.log("Entering view menu");
                    await this.viewMenu();
                    break;
                case '2':
                    this.socketController.emit('getRolloutItems');
                    break;
                case '3':
                    await this.chooseItem(user);
                    break;
                case '4':
                    console.log('Exiting Employee Panel');
                    exit = true;
                    break;
                default:
                    console.log('Invalid option');
            }
        }
    }

    private async chooseItem(user: any) {
        const date = new Date().toISOString().split('T')[0];

        this.socketController.emit('getNotificationByDate', { date });

        const data = await new Promise((resolve) => {
            this.socketController.once('getNotificationByDateSuccess', (data) => {
                resolve(data.notification);
            });
        }) as any;

        const firstNotificationData = data[0].notification_data[0];

        console.table(firstNotificationData);

        await this.getUserInput(firstNotificationData, user);
    }

    private async getUserInput(firstNotificationData, user) {
        try {
            return new Promise(async (resolve) => {
                const action = await askQuestion('Enter item ID: ');
                console.log('action', action);



                const selectedItem = firstNotificationData.filter((item: any) => item.item_id == action)[0];
                const category = selectedItem.category;

                console.log("category:", selectedItem, category);

                const isAlreadyProvidedFeedback = await this.isAlreadyVoted(selectedItem.category, user);

                if (isAlreadyProvidedFeedback) {
                    console.log(`You have already voted for ${selectedItem.category}`);
                    return;
                }
                
                await this.vote(category, user, selectedItem.item_id)

            });
        } catch (error) {
            console.error('Error getting user input:', error);
            throw error;
        }
    }

    public async vote(category, user, menu_id) {
        return new Promise((resolve, reject) => {
            this.socketController.emit('createUserVote', { category, user, menu_id });

            this.socketController.on('createUserVoteSuccess', (data) => {
                resolve(data);
            });

            this.socketController.on('createUserVoteError', (error: any) => {
                reject(new Error(error.message || 'Failed to vote'));
            });
        });
    }

    public async isAlreadyVoted(category: string, user: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.socketController.emit('getUserVotesByCondition', { category, user });

            this.socketController.on('getUserVotesByConditionSuccess', (data: boolean) => {
                resolve(data);
            });

            this.socketController.on('getUserVotesByConditionError', (error: any) => {
                reject(new Error(error.message || 'Failed to check if already voted'));
            });
        });
    }

    private async viewMenu() {
        this.socketController.emit("viewMenu");
    }
}
