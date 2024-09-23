import type { QueryKey } from "@tanstack/react-query";
import EventEmitter from "events";

export type RoomData = {
  key: QueryKey;
  userIds: string[];
};

export default class RoomController {
  private static instance: RoomController;
  private constructor() {}

  static getInstance(): RoomController {
    if (!RoomController.instance) {
      RoomController.instance = new RoomController();
    }
    return RoomController.instance;
  }

  private emitter = new EventEmitter();

  public subscribe(callback: (data: RoomData) => void) {
    this.emitter.on("message", callback);
  }

  public unsubscribe(callback: (data: RoomData) => void) {
    this.emitter.off("message", callback);
  }

  public invalidateKey(data: RoomData): void {
    this.emitter.emit("message", data);
  }
}
