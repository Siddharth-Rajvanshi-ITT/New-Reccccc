import { Socket } from "socket.io";
import RecommendationSocketHandler from "../controllers/recommendation";

const recommendationSocketHandler = new RecommendationSocketHandler();


export default class RecommendationEventHandler {
    socket
    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("getRecommendedItems", async (data) => {
            console.log('getRecommendationItems called------------------------------')
            await recommendationSocketHandler.getRecommendedMenuItems(this.socket);
        });
    }
}