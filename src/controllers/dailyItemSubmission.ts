import { Socket } from 'socket.io';
import DailyItemSubmissionService from '../services/dailyItemSubmission';

class DailyItemSubmissionController {
    private dailyItemSubmissionService: DailyItemSubmissionService;
    public createDailyItemSubmission = async (socket: Socket, data: any): Promise<void> => {
        const { menu_type, date } = data;
        console.log('createDailyItemSubmission', menu_type, date);
        try {
            const dailyItemSubmission = await this.dailyItemSubmissionService.createDailyItemSubmission(menu_type, date);
            socket.emit('createDailyItemSubmissionSuccess', dailyItemSubmission);
        } catch (error) {
            socket.emit('createDailyItemSubmissionError', { error: error.message });
        }
    };
    public deleteDailyItemSubmission = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.dailyItemSubmissionService.deleteDailyItemSubmission(id);
            socket.emit('deleteDailyItemSubmissionSuccess');
        } catch (error) {
            socket.emit('deleteDailyItemSubmissionError', { error: error.message });
        }
    };
    public getDailyItemSubmissionByDate = async (socket: Socket, data: any): Promise<void> => {
        const { date } = data;
        try {
            const dailyItemSubmission = await this.dailyItemSubmissionService.getDailyItemSubmissionByDate(date);
            socket.emit('getDailyItemSubmissionByDateSuccess', dailyItemSubmission);
        } catch (error) {
            socket.emit('getDailyItemSubmissionByDateError', { error: error.message });
        }
    };
    public getDailyItemSubmissionById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const dailyItemSubmission = await this.dailyItemSubmissionService.getDailyItemSubmissionById(id);
            socket.emit('getDailyItemSubmissionByIdSuccess', dailyItemSubmission);
        } catch (error) {
            socket.emit('getDailyItemSubmissionByIdError', { error: error.message });
        }
    };
    public getDailyItemSubmissions = async (socket: Socket): Promise<void> => {
        try {
            const dailyItemSubmissions = await this.dailyItemSubmissionService.getDailyItemSubmissions();
            socket.emit('getDailyItemSubmissionsSuccess', dailyItemSubmissions);
        } catch (error) {
            socket.emit('getDailyItemSubmissionsError', { error: error.message });
        }
    };
    public updateDailyItemSubmission = async (socket: Socket, data: any): Promise<void> => {
        const { menu_type, date } = data;
        try {
            const dailyItemSubmission = await this.dailyItemSubmissionService.updateDailyItemSubmission(menu_type, date);
            socket.emit('updateDailyItemSubmissionSuccess', dailyItemSubmission);
        } catch (error) {
            socket.emit('updateDailyItemSubmissionError', { error: error.message });
        }
    };

    constructor() {
        this.dailyItemSubmissionService = new DailyItemSubmissionService();
    }
}

export default DailyItemSubmissionController;
