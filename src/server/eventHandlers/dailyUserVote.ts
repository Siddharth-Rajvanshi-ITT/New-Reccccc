import { Socket } from "socket.io";
import DailyUserVoteSocketHandler from "../controllers/dailyUserVote";

const dailyUserVoteSocketHandler = new DailyUserVoteSocketHandler();

export default class DailyUserVoteEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on("createUserVote", async (data) => {
            await dailyUserVoteSocketHandler.createUserVote(this.socket, data);
        });
        this.socket.on("getUserVotes", async () => {
            await dailyUserVoteSocketHandler.getUserVotes(this.socket);
        });
        this.socket.on("getUserVoteById", async (data) => {
            await dailyUserVoteSocketHandler.getUserVoteById(this.socket, data);
        });
        this.socket.on("getUserVotesByCondition", async (data) => {
            await dailyUserVoteSocketHandler.getUserVotesByCondition(this.socket, data);
        });
        this.socket.on("updateUserVote", async (data) => {
            await dailyUserVoteSocketHandler.updateUserVote(this.socket, data);
        });
        this.socket.on("deleteUserVote", async (data) => {
            await dailyUserVoteSocketHandler.deleteUserVote(this.socket, data);
        });
    }
}