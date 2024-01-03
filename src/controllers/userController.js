const {User,userdesignationModel,designation} =require("../models")
exports.getdesignation = async (req, res) => {
    try {
      const designationdata = await designation.find();

      res.status(200).json({success:true,designationdata });
    } catch (error) {
        console.log("error=================>",error)
      res.status(500).json({ success: false,message:'Server error' });
    }
  };
exports.getAllUserData = async (req, res) => {
    try {
      const UserData = await User.find().populate("designationsIDs");
      res.status(200).json({success:true,UserData });
    } catch (error) {
        console.log("error=================>",error)
      res.status(500).json({ success: false,message:'Server error' });
    }
};
exports.DeleteUser = async (req, res) => {
  try {
    console.log("🚀 ~ file: userController.js:25 ~ exports.DeleteUser ~ req.query.UserId:", req.query.UserId)
    const DeleteUserData = await User.deleteOne({_id:req.query.UserId});
    if(DeleteUserData.deletedCount>0){
      res.status(200).json({success:true,message:"User Deleted Succesfully..!",DeleteUserData });

    }else
    {
      res.status(200).json({success:false,message:"No user Found..!",DeleteUserData });
  
    }
  } catch (error) {
      console.log("error=================>",error)
    res.status(500).json({ success: false,message:'Server error' });
  }
};