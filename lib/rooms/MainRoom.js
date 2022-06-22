"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRoom = void 0;
const colyseus_1 = require("colyseus");
const MainRoomState_1 = require("./schema/MainRoomState");
class MainRoom extends colyseus_1.Room {
    onCreate(options) {
        this.setState(new MainRoomState_1.MainRoomState());
        this.onMessage("updateTargetPosition", (client, data) => {
            console.log("updating player " + client.sessionId);
            const player = this.state.players.get(client.sessionId);
            player.x = data.x;
            player.y = data.y;
            player.z = data.z;
            player.lookAtX = data.x;
            player.lookAtY = data.y;
            player.lookAtZ = data.z;
            player.teleport = false;
        });
        this.onMessage("teleport", (client, data) => {
            console.log("teleporting player " + client.sessionId + " to " + data.location);
            const player = this.state.players.get(client.sessionId);
            if (data.location == 'hall') {
                player.x = 8;
                player.y = 0;
                player.z = 6;
                player.lookAtX = 0;
                player.lookAtY = 0;
                player.lookAtZ = 2;
                player.teleport = true;
            }
            else if (data.location == 'auditorium') {
                player.x = -11;
                player.y = 0;
                player.z = 9.5;
                player.lookAtX = -9.4;
                player.lookAtY = 0;
                player.lookAtZ = -8.2;
                player.teleport = true;
            }
        });
        this.onMessage("sendChatMessage", (client, data) => {
            console.log(client.sessionId + " says " + data.message);
            const player = this.state.players.get(client.sessionId);
            this.state.lastChatLine.playerName = player.name;
            this.state.lastChatLine.message = data.message;
            this.state.lastChatLine.color = player.color;
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const player = new MainRoomState_1.Player();
        const FLOOR_SIZE_X = 18;
        const FLOOR_SIZE_Z = 4;
        player.x = 8; //-(FLOOR_SIZE_X/2) + (Math.random() * FLOOR_SIZE_X);
        player.y = 0;
        player.z = 6; //5 + (Math.random() * FLOOR_SIZE_Z);
        player.lookAtX = 0;
        player.lookAtY = 0;
        player.lookAtZ = 2;
        player.teleport = false;
        player.name = options.name;
        player.avatarId = options.avatarId;
        player.color = String.fromCharCode(Math.round(65 + Math.random() * 5))
            + String.fromCharCode(Math.round(65 + Math.random() * 5))
            + String.fromCharCode(Math.round(65 + Math.random() * 5))
            + String.fromCharCode(Math.round(65 + Math.random() * 5))
            + String.fromCharCode(Math.round(65 + Math.random() * 5))
            + String.fromCharCode(Math.round(65 + Math.random() * 5));
        console.log(player.name + " gets color " + player.color);
        this.state.players.set(client.sessionId, player);
        this.state.lastChatLine.playerName = "";
        this.state.lastChatLine.message = player.name + " joined the room!";
        this.state.lastChatLine.color = "55FF55";
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
        const player = this.state.players.get(client.sessionId);
        this.state.lastChatLine.playerName = "";
        this.state.lastChatLine.message = player.name + " left the room!";
        this.state.lastChatLine.color = "55FF55";
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.MainRoom = MainRoom;
