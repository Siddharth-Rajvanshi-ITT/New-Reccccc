import DailyItemSubmission from "../models/dailyItemSubmission";

class DailyItemSubmissionService {
    async createDailyItemSubmission(menu_type: string, date: string) {
        console.log('createDailyItemSubmission', menu_type, date);
        try {
            let dailyItemSubmission;

            if (menu_type === 'breakfast') {
                console.log('Creating dailyItemSubmission - breakfast');
                dailyItemSubmission = await DailyItemSubmission.create({ breakfast: true, date });
            } else if (menu_type === 'lunch') {
                console.log('Creating dailyItemSubmission - lunch');
                dailyItemSubmission = await DailyItemSubmission.create({ lunch: true, date });
            } else if (menu_type === 'dinner') {
                console.log('Creating dailyItemSubmission - dinner');
                dailyItemSubmission = await DailyItemSubmission.create({ dinner: true, date });
            }

            return dailyItemSubmission;
        } catch (error) {
            console.log('Error creating dailyItemSubmission', error);
            throw new Error(error.message);
        }
    }

    async deleteDailyItemSubmission(id: number) {
        try {
            const dailyItemSubmission = await DailyItemSubmission.findByPk(id);
            if (!dailyItemSubmission) {
                throw new Error("DailyItemSubmission not found");
            }
            await dailyItemSubmission.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyItemSubmissionByDate(date: string) {
        console.log('getDailyItemSubmissionByDate', date);
        try {
            console.log('Finding dailyItemSubmission');
            const dailyItemSubmission = await DailyItemSubmission.findOne({ where: { date } });
            console.log('dailyItemSubmission', dailyItemSubmission);
            return dailyItemSubmission;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyItemSubmissionById(id: number) {
        try {
            const dailyItemSubmission = await DailyItemSubmission.findByPk(id);
            if (!dailyItemSubmission) {
                throw new Error("DailyItemSubmission not found");
            }
            return dailyItemSubmission;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyItemSubmissions() {
        try {
            const dailyItemSubmissions = await DailyItemSubmission.findAll();
            return dailyItemSubmissions;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDailyItemSubmission(menu_type: string, date: string) {
        try {
            let dailyItemSubmission;

            if (menu_type === 'breakfast') {
                dailyItemSubmission = await DailyItemSubmission.update({ breakfast: true }, { where: { date } });
            } else if (menu_type === 'lunch') {
                dailyItemSubmission = await DailyItemSubmission.update({ lunch: true }, { where: { date } });
            } else if (menu_type === 'dinner') {
                dailyItemSubmission = await DailyItemSubmission.update({ dinner: true }, { where: { date } });
            }

            return dailyItemSubmission;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyItemSubmissionService;
