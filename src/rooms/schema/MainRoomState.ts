import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  @type("number") lookAtX: number;
  @type("number") lookAtY: number;
  @type("number") lookAtZ: number;
  @type("boolean") teleport: boolean;
  @type("number") avatarId: number;
  @type("string") name: string;
  @type("string") color: string;
}

export class ChatLine extends Schema {
  @type("string") playerName: string;
  @type("string") message: string;
  @type("string") color: string;
}

export class MainRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(ChatLine) lastChatLine : ChatLine = new ChatLine(); 
}
