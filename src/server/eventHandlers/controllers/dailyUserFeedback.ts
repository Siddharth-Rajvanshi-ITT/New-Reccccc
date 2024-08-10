import { Socket } from 'socket.io';
import DailyUserFeedbackService from '../services/dailyUserFeedback';
import FeedbackService from '../services/feedback';

class DailyUserFeedbackController {
    private dailyUserFeedbackService: DailyUserFeedbackService;
    private feedbackService: FeedbackService;
    public createUserFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { category, rating, comment } = data.menu_item;
        const { id: user_id } = data.user;
        const date = new Date().toISOString().split('T')[0];

        try {
            const feedback = await this.dailyUserFeedbackService.createUserFeedback(user_id, category, date);
            await this.feedbackService.createFeedback(data.menu_item.id, user_id, rating, comment, new Date(), category);

            socket.emit('createUserFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('createUserFeedbackError', { message: error.message });
        }
    };
    public deleteUserFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.dailyUserFeedbackService.deleteUserFeedback(id);
            socket.emit('deleteUserFeedbackSuccess');
        } catch (error) {
            socket.emit('deleteUserFeedbackError', { error: error.message });
        }
    };
    public getUserFeedbackById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const feedback = await this.dailyUserFeedbackService.getUserFeedbackById(id);
            socket.emit('getUserFeedbackByIdSuccess', feedback);
        } catch (error) {
            socket.emit('getUserFeedbackByIdError', { error: error.message });
        }
    };
    public getUserFeedbacks = async (socket: Socket): Promise<void> => {
        try {
            const feedbacks = await this.dailyUserFeedbackService.getUserFeedbacks();
            socket.emit('getUserFeedbacksSuccess', feedbacks);
        } catch (error) {
            socket.emit('getUserFeedbacksError', { error: error.message });
        }
    };
    public getUserFeedbacksByCondition = async (socket: Socket, data: any): Promise<void> => {
        const { category } = data;
        const { id: user_id } = data.user;
        const date = new Date().toISOString().split('T')[0];
        try {
            const isAlreadyProvidedFeedback = await this.dailyUserFeedbackService.getUserFeedbacksByCondition(user_id, category, date);
            console.log("isAlreadyProvidedFeedback", isAlreadyProvidedFeedback)
            socket.emit('getUserFeedbacksByConditionSuccess', isAlreadyProvidedFeedback);
        } catch (error) {
            socket.emit('getUserFeedbacksByConditionError', { message: error.message });
        }
    };
    public updateUserFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id, category } = data;
        try {
            const feedback = await this.dailyUserFeedbackService.updateUserFeedback(id, category);
            socket.emit('updateUserFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('updateUserFeedbackError', { error: error.message });
        }
    };

    constructor() {
        this.dailyUserFeedbackService = new DailyUserFeedbackService();
        this.feedbackService = new FeedbackService();
    }
}

export default DailyUserFeedbackController;
