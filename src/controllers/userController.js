const Users = require("./../model/users");
const AppError = require("./../utils/AppError");
const { dataUri } = require("./../utils/multer");
const { uploader } = require("./../utils/cloudinary")

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();

    if (!users) {
      throw new AppError("No users found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "all user fetched successfully",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      throw new AppError(`Users with id ${id} not found`, 404);
    }

    const fullname = user.getFullName();

    res.status(200).json({
      status: "success",
      message: "user retrieved successfull",
      data: {
        user,
        fullname,
      },
    });
  } catch (error) {
    next(error);
  }
};

//update-profile picture

const updateProfilePicture = async(req, res, next)=>{
    try {

        const userId = req.user._id;

        const user = await Users.findById(userId);

        if(!user){
            throw new AppError(`User not found with id ${userId}`, 404)
        };

        const file = req.file;
        const imageData = dataUri(file).content;
        const result = await uploader.upload(imageData, {
            folder: "Ecommerce/profile_images"
        });


        user.profile_image = result.secure_url;

        user.save();

        res.status(200).json({
            status: "succesful",
            message: "profile picture updated successfully",
            data: {
                user
            }
        })
        
    } catch (error) {
        next(error)

    }
};

const updateProfile = async(req, res, next)=>{
    try {
         const userId = req.user._id;

        const user = await Users.findById(userId);


        if(!user){
            throw new AppError(`User not found with id ${userId}`, 404)
        };

        if(!req.body || Object.keys(req.body).length === 0){
            throw new AppError("No update data provided", 400)
        }

        const allowedFields = ["firstname", "lastname", "bio"];
        const fieldsToUpdate = Object.keys(req.body);
        fieldsToUpdate.forEach((field)=>{
           if(allowedFields.includes(field)){
              user[field]  = req.body[field];
           }
           else{
            throw new AppError(`Field ${field} is not allowed`, 403)
           }
        });

        await user.save();

        res.status(200).json({
            status: "success",
            message: "profile updated successfully",
            data: {
                user
            }
        })

        
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
  getAllUsers,
  getUserProfile,
  updateProfilePicture,
  updateProfile
};
