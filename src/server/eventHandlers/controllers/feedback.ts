import { Socket } from 'socket.io';
import FeedbackService from '../services/feedback';

class FeedbackController {
    private feedbackService: FeedbackService;
    public createFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { item_id, user_id, rating, comment, feedback_date , category } = data;
        try {
            const feedback = await this.feedbackService.createFeedback(item_id, user_id, rating, comment, feedback_date, category);
            socket.emit('createFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('createFeedbackError', { error: error.message });
        }
    };
    public deleteFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.feedbackService.deleteFeedback(+id);
            socket.emit('deleteFeedbackSuccess');
        } catch (error) {
            socket.emit('deleteFeedbackError', { error: error.message });
        }
    };
    public getFeedbackById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const feedback = await this.feedbackService.getFeedbackById(+id);
            socket.emit('getFeedbackByIdSuccess', feedback);
        } catch (error) {
            socket.emit('getFeedbackByIdError', { error: error.message });
        }
    };
    public getFeedbacks = async (socket: Socket): Promise<void> => {
        try {
            const feedbacks = await this.feedbackService.getFeedbacks();
            socket.emit('getFeedbacksSuccess', feedbacks);
        } catch (error) {
            socket.emit('getFeedbacksError', { error: error.message });
        }
    };
    public updateFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id, item_id, user_id, rating, comment, feedback_date } = data;
        try {
            const feedback = await this.feedbackService.updateFeedback(+id, item_id, user_id, rating, comment, feedback_date);
            socket.emit('updateFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('updateFeedbackError', { error: error.message });
        }
    };

    constructor() {
        this.feedbackService = new FeedbackService();
    }
}

export default FeedbackController;
