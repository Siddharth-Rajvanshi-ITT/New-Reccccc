import DailyUserFeedback from "../models/dailyUserFeedback";

class DailyUserFeedbackService {
    private async checkUserFeedback(user_id: number, category: string, date: string) {
        try {
            const feedback = await DailyUserFeedback.findOne({ where: { user_id, category, date } });
            return feedback;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createUserFeedback(user_id: number, category: string, date: string) {
        try {
            console.log('inside createUserFeedback')
            const existingFeedback = await this.checkUserFeedback(user_id, category, date);
            console.log('existingFeedback', existingFeedback)
            if (existingFeedback) {
                throw new Error("You have already provided feedback for this category today");
            }

            console.log('creating user feedback')
            const feedback = await DailyUserFeedback.create({ user_id, category, date });
            console.log('user feedback created:', feedback)

            return feedback;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteUserFeedback(id: number) {
        try {
            const feedback = await DailyUserFeedback.findByPk(id);
            if (!feedback) {
                throw new Error("Feedback not found");
            }
            await feedback.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserFeedbackById(id: number) {
        try {
            const feedback = await DailyUserFeedback.findByPk(id);
            if (!feedback) {
                throw new Error("Feedback not found");
            }
            return feedback;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserFeedbacks() {
        try {
            const feedbacks = await DailyUserFeedback.findAll();
            return feedbacks;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserFeedbacksByCondition(user_id: number, category: string, date: string) {
        try {
            const feedbacks = await DailyUserFeedback.findOne({ where: { user_id, date, category } });

            if (feedbacks) {
                return true;
            }

            return false;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUserFeedback(id: number, category: string) {
        try {
            const feedback = await DailyUserFeedback.findByPk(id);
            if (!feedback) {
                throw new Error("Feedback not found");
            }
            feedback.category = category;
            await feedback.save();
            return feedback;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyUserFeedbackService;
