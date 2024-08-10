import { SocketController } from '../controllers/socketController';

export class EmployeeRepository {
    private socketController: SocketController;

    constructor(socketController: SocketController) {
        this.socketController = socketController;
    }

    public async updateEmployeePreference(id: string, mealType: string, spiceLevel: string, category: string, sweetTooth: string) {
        this.socketController.emit('updateEmployeePreference', { id, mealType, spiceLevel, category, sweetTooth });
    }

    public async getDiscardFeedbacksByCondition(item_id: string, user_id: string): Promise<boolean> {
        this.socketController.emit('getDiscardFeedbacksByCondition', { item_id, user_id });

        return new Promise((resolve) => {
            this.socketController.once('getDiscardFeedbacksByConditionSuccess', (data) => {
                resolve(data.isAlreadyProvidedFeedback);
            });
        });
    }

    public async showDiscardMenuItem(): Promise<any> {
        this.socketController.emit('showDiscardMenuItem');

        return new Promise((resolve) => {
            this.socketController.once('showDiscardMenuItemSuccess', (data) => {
                resolve(data.discardRollOutItem);
            });
        });
    }

    public async createDiscardFeedback(item_id: string, user_id: string, answers1: string, answers2: string, answers3: string) {
        this.socketController.emit('createDiscardFeedback', { item_id, user_id, answers1, answers2, answers3 });
    }

    public async getDailyMenuItemByDate(date: string): Promise<any[]> {
        this.socketController.emit('getDailyMenuItemByDate', { date });

        return new Promise((resolve) => {
            this.socketController.once('getDailyMenuItemByDateSuccess', (data) => {
                resolve(data.dailyMenuItems);
            });
        });
    }

    public async isAlreadyProvidedFeedback(category: string, user: any): Promise<boolean> {
        this.socketController.emit('isAlreadyProvidedFeedback', { category, user });

        return new Promise((resolve) => {
            this.socketController.once('isAlreadyProvidedFeedbackSuccess', (data) => {
                resolve(data.isAlreadyProvidedFeedback);
            });
        });
    }

    public async createFeedback(item_id: string, user_id: string, rating: number, comment: string, feedback_date: string, category: string) {
        this.socketController.emit('createFeedback', { item_id, user_id, rating, comment, feedback_date, category });
    }

    public async isAlreadyVoted(category: string, user: any): Promise<boolean> {
        this.socketController.emit('isAlreadyVoted', { category, user });

        return new Promise((resolve) => {
            this.socketController.once('isAlreadyVotedSuccess', (data) => {
                resolve(data.isAlreadyVoted);
            });
        });
    }

    public async vote(category: string, user: any, item_id: string) {
        this.socketController.emit('vote', { category, user, item_id });
    }
}
