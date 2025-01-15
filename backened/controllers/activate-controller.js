const userService = require("../services/user-service");
const sharp = require('sharp');
const path = require("path");
const UserDto = require("../dtos/user-dto");


class ActivateController {
  async activate(req, res){
    const { name, avatar } = req.body;

    if(!name || !avatar){
      return res.status(400).json({message: 'All fields are required'})
    }

    const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64")

    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`

    try{
      const processedImage = await sharp(buffer).resize(150).toBuffer()
      await sharp(processedImage).toFile(path.resolve(__dirname, `../storage/${imagePath}`))

    } catch(err){
      console.log(err)
      return res.status(500).json({message: "couldn't process the image"})
    }

    const userId = req.user._id

    // update user
    try{
      const user = await userService.findUser({_id: userId})
      if(!user){
        return res.status(404).json({message: "user not found"})
      }
  
      user.activated = true
      user.name = name
      user.avatar = `/storage/${imagePath}`
      await user.save();
  
      res.json({auth: true, user: new UserDto(user)})

    } catch(err){
      res.status(500).json({message: "something went wrong"})
    }
  }
}

module.exports = new ActivateController();