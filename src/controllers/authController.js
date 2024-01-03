
const {generateAccessToken,generateRefreshToken} =require("../services/auth.Service")
const {User,userdesignationModel} =require("../models")


// Hashing and storing the password during user signup
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  console.log("req.body============>",req.body)

  const { fName, lName, email, phone, address, username, password ,designation,cnic} = req.body;
  try {
    const existingUser = await User.findOne({ username });
    const existingUserByemail = await User.findOne({ email });
    const existingUserByMobile = await User.findOne({ phone });
    if (existingUserByMobile) {
      return res.status(200).json({ success:false, message: 'This Mobile Number is already registered' });
    }
    if (existingUserByemail) {
      return res.status(200).json({ success:false, message: 'Email is already in registered' });
    }
    if (existingUser) {
      return res.status(200).json({ success:false, message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(200).json({success:false, message: 'Invalid email format' });
    }
// 
    // Phone number validation using regular expression
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(200).json({ success:false, message: 'Invalid phone number' });
    }
    const designationData=[]
    designationData.push(designation)
    const newUser = new User({
      fName,
      lName,
      email,
      phone,
      address,
      username,
      cnic,
      password: hashedPassword,
      designationsIDs:designationData
    });
if(!newUser){
  res.status(200).json({ success:false,message:"Username And password is incorect." });
}
// let userdesignationModelData=  await userdesignationModel.create({
//   userID:newUser._id,
//   designationID:designation
// })
    // Email validation using regular expression
  //  await userdesignationModelData.save()
    await newUser.save();


    res.status(201).json({success:true, message: 'User Created Successfully..!', user: newUser });
  } catch (error) {
    console.log("error=================>",error)
    res.status(500).json({ success:false, message: 'Server error' });
  }
};
// Comparing the hashed password during user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({success:false, message: 'Invalid email' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed password

    if (!passwordMatch) {
      return res.status(200).json({success:false, message: 'Invalid Password' });
    }

    const accessToken = generateAccessToken({ id: user._id, email });
    const refreshToken = generateRefreshToken({ id: user._id, email });

    res.status(200).json({success:true,message:"Login SuccessFully..!", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ success: 'Server error' });
  }
};










  