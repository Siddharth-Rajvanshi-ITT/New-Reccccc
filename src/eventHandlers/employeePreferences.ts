import { Socket } from 'socket.io';
import EmployeePreferencesController from '../controllers/employeePreferences';

const employeePreferencesController = new EmployeePreferencesController();

export default class EmployeePreferencesEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on('createEmployeePreference', async (data) => {
            await employeePreferencesController.createEmployeePreference(this.socket, data);
        });
        this.socket.on('getEmployeePreferences', async () => {
            await employeePreferencesController.getAllEmployeePreferences(this.socket);
        });
        this.socket.on('getEmployeePreference', async (data) => {
            await employeePreferencesController.getEmployeePreference(this.socket, data);
        });
        this.socket.on('updateEmployeePreference', async (data) => {
            await employeePreferencesController.updateEmployeePreference(this.socket, data);
        });
        this.socket.on('deleteEmployeePreference', async (data) => {
            await employeePreferencesController.deleteEmployeePreference(this.socket, data);
        });
    }
}
