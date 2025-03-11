import EventEmitter from "events";

export default class InvalidationController {
  private static instance: InvalidationController;
  private constructor() {}

  static getInstance(): InvalidationController {
    if (!InvalidationController.instance) {
      InvalidationController.instance = new InvalidationController();
    }
    return InvalidationController.instance;
  }

  private emitter = new EventEmitter();

  public subscribe(callback: (userIds: string[]) => void) {
    this.emitter.on("message", callback);
  }

  public unsubscribe(callback: (userIds: string[]) => void) {
    this.emitter.off("message", callback);
  }

  public invalidateKey(userIds: string[]): void {
    this.emitter.emit("message", userIds);
  }
}
