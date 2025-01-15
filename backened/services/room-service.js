const RoomModel = require("../models/room-model")

class RoomService {
  async create(payload){
    const { ownerId, roomType, topic } = payload;
    const room = await RoomModel.create({
      topic,
      ownerId,
      roomType,
      speakers: [ownerId]
    })

    return room;
  }

  async getAllRooms(types){
    return await RoomModel.find({roomType: {$in: types}}).populate("speakers").populate("ownerId").exec();
  }

  async getRoom(roomId){
    const room = await RoomModel.findOne({_id: roomId});
    return room;
  }
}

module.exports = new RoomService()