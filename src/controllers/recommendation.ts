import { Socket } from 'socket.io';
import MenuItemService from '../services/menuItem';
import RecommendationEngineService from '../services/recommendationEngine';

class RecommendationController {
    private recommendationEngineService: RecommendationEngineService;
    private menuItemsService: MenuItemService;

    constructor() {
        this.recommendationEngineService = new RecommendationEngineService();
        this.menuItemsService = new MenuItemService();
    }

    public async getRecommendedMenuItems(socket: Socket, menu_type) {
        try {
            const menuItems = await this.recommendationEngineService.getRecommendations(menu_type);
            socket.emit('getRecommendedItemsSuccess', menuItems);
        } catch (error) {
            socket.emit('getRecommendedItemsError', { error: error.message });
        }
    };

    public async getDiscardableMenuItems(socket: Socket, menu_type) {
        try {
            const menuItems = await this.recommendationEngineService.getDiscardableItems(menu_type);
            console.log("Got the menu items:" , menuItems )
            socket.emit('getDiscardableItemsSuccess', menuItems);
        } catch (error) {
            socket.emit('getDiscardableItemsError', { error: error.message });
        }
    };

    public async discardMenuItems(socket: Socket, selectedItem) {
        try {
            console.log(selectedItem.id)
            await this.menuItemsService.deleteMenuItem(selectedItem.id);
            socket.emit('discardItemSuccess');
        } catch (error) {
            socket.emit('discardItemError', { error: error.message });
        }
    };
}

export default RecommendationController;
