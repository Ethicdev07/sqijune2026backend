const Users = require("./../model/users");
const AppError = require("./../utils/AppError");
const {dataUri} = require("./../utils/multer");
const {uploader} = require("./../utils/cloudinary")

const getAllUsers = async(req, res, next)=> {
    try {
        
        const users = await Users.find();

        if(!users){
            throw new AppError("No users found", 404)
        };

        res.status(200).json({
            status: "success",
            message: "all user fetched successfully",
            result: users.length,
            data: {
                users,
            }
        });

    } catch (error) {
        next(error);
    };

};


const getUserProfile = async(req, res, next)=>{
    const userId = req.user._id;

    try {
        
        const user = await Users.findById(userId);

        if(!user){
            throw new AppError(`Users with id ${id} not found`, 404)
        };

        const fullname = user.getFullName();

        res.status(200).json({
            status: 'success',
            message: 'user retrieved successfull',
            data: {
                user, 
                fullname
            }
        })

    } catch (error) {
        next(error)
    }
};



//update-password

module.exports = {
    getAllUsers,
    getUserProfile,
   
}