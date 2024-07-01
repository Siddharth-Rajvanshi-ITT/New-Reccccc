import { Socket } from 'socket.io';
import RecommendationEngineService from '../services/recommendationEngine';

class RecommendationController {
    private recommendationEngineService: RecommendationEngineService;

    constructor() {
        this.recommendationEngineService = new RecommendationEngineService();
    }

    public async getRecommendedMenuItems(socket: Socket) {
        try {
            const menuItems = await this.recommendationEngineService.getRecommendations();
            console.log('----------got the items-----------')
            socket.emit('getRecommendedItemsSuccess', menuItems);
        } catch (error: any) {
            socket.emit('getRecommendedItemsError', { error: error.message });
        }
    };
}

export default RecommendationController;