import { Socket } from 'socket.io';
import MenuAttributesService from '../services/menuAttributes';

class MenuAttributesController {
    private menuAttributesService: MenuAttributesService;

    public createMenuAttribute = async (socket: Socket, data: any): Promise<void> => {
        const { menuId, mealType, spiceLevel, category, sweetTooth } = data;
        try {
            const menuAttribute = await this.menuAttributesService.createMenuAttribute(menuId, mealType, spiceLevel, category, sweetTooth);
            socket.emit('createMenuAttributeSuccess', menuAttribute);
        } catch (error) {
            socket.emit('createMenuAttributeError', { error: error.message });
        }
    };

    public deleteMenuAttribute = async (socket: Socket, data: any): Promise<void> => {
        const { menuId } = data;
        try {
            await this.menuAttributesService.deleteMenuAttribute(menuId);
            socket.emit('deleteMenuAttributeSuccess');
        } catch (error) {
            socket.emit('deleteMenuAttributeError', { error: error.message });
        }
    };
    public getAllMenuAttributes = async (socket: Socket): Promise<void> => {
        try {
            const menuAttributes = await this.menuAttributesService.getAllMenuAttributes();
            socket.emit('getAllMenuAttributesSuccess', menuAttributes);
        } catch (error) {
            socket.emit('getAllMenuAttributesError', { error: error.message });
        }
    };
    public getMenuAttribute = async (socket: Socket, data: any): Promise<void> => {
        const { menuId } = data;
        try {
            const menuAttribute = await this.menuAttributesService.getMenuAttribute(menuId);
            socket.emit('getMenuAttributeSuccess', menuAttribute);
        } catch (error) {
            socket.emit('getMenuAttributeError', { error: error.message });
        }
    };
    public updateMenuAttribute = async (socket: Socket, data: any): Promise<void> => {
        const { menuId, mealType, spiceLevel, category, sweetTooth } = data;
        try {
            const menuAttribute = await this.menuAttributesService.updateMenuAttribute(menuId, mealType, spiceLevel, category, sweetTooth);
            socket.emit('updateMenuAttributeSuccess', menuAttribute);
        } catch (error) {
            socket.emit('updateMenuAttributeError', { error: error.message });
        }
    };

    constructor() {
        this.menuAttributesService = new MenuAttributesService();
    }
}

export default MenuAttributesController;
