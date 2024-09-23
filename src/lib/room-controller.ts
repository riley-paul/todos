export default class RoomController {
  private static instance: RoomController;
  private constructor() { }
  
  static getInstance(): RoomController {
    if (!RoomController.instance) {
      RoomController.instance = new RoomController();
    }
    return RoomController.instance;
  }


}