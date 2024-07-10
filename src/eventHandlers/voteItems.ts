import { Socket } from "socket.io";
import VoteItemController from "../controllers/voteItems";

const voteItemController = new VoteItemController();

export default class VoteItemEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public listen(): void {
        this.socket.on("createVoteItem", async (data) => {
            console.log(data)
            await voteItemController.createVoteItem(this.socket, data);
        });

        this.socket.on("getVoteItems", async (data) => {
            await voteItemController.getVoteItems(this.socket, data);
        });

        this.socket.on("getVoteItemById", async (data) => {
            await voteItemController.getVoteItemById(this.socket, data);
        });

        this.socket.on("updateVoteItem", async (data) => {
            await voteItemController.updateVoteItem(this.socket, data);
        });

        this.socket.on("deleteVoteItem", async (data) => {
            await voteItemController.deleteVoteItem(this.socket, data);
        });

        this.socket.on("vote", async (data) => {
            console.log('vote event');
            await voteItemController.vote(this.socket, data);
        });
    }
}