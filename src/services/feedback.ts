// import { where } from "sequelize";
import Feedback from "../models/feedback";
import MenuItem from "../models/menuItem";

class FeedbackService {
    async createFeedback(item_id: number, user_id: number, rating: number, comment: string, feedback_date: Date) {
        try {
            const feedback = await Feedback.create({ item_id, user_id, rating, comment, feedback_date });
            return feedback;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getFeedbacks() {
        try {
            const feedbacks = await Feedback.findAll();
            return feedbacks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getFeedbackById(feedback_id: number) {
        try {
            const feedback = await Feedback.findByPk(feedback_id);
            if (!feedback) {
                throw new Error("Feedback not found");
            }
            return feedback;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async getFeedbacksByMenuType() {
        try {
            const feedbacks = await Feedback.findAll();

            if (!feedbacks.length) {
                throw new Error("Feedback not found");
            }

            return feedbacks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async updateFeedback(feedback_id: number, item_id: number, user_id: number, rating: number, comment: string, feedback_date: Date) {
        try {
            const feedback = await Feedback.findByPk(feedback_id);
            if (!feedback) {
                throw new Error("Feedback not found");
            }
            feedback.item_id = item_id;
            feedback.user_id = user_id;
            feedback.rating = rating;
            feedback.comment = comment;
            feedback.feedback_date = feedback_date;
            await feedback.save();
            return feedback;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    async deleteFeedback(feedback_id: number) {
        try {
            const feedback = await Feedback.findByPk(feedback_id);
            if (!feedback) {
                throw new Error("Feedback not found");
            }
            await feedback.destroy();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
}

export default FeedbackService;