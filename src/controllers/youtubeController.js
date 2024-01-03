const { google } = require('googleapis');
const admin = require('firebase-admin');
const youtube = google.youtube('v3');
const jwt = require('jsonwebtoken');
const readline = require('readline');
const db = require("../models/index")
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore/lite');
const firebasedb = require("../../firebase/config")
const fs = require('fs');
// YouTube API credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENTID,
    process.env.GOOGLE_SECRETKEY,
    process.env.REDIRECT_URI,
);
const SCOPES = ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
// Function to search YouTube videos
const searchYouTubeVideos = async (searchQuery, maxResults) => {
    try {
        const response = await youtube.search.list({
            key: process.env.YOUTUBE_SECRETKEY,
            q: searchQuery,
            maxResults: maxResults || 10,
            part: 'id',
            type: 'video',
        });

        return response.data.items;
    } catch (error) {
        console.error('Error searching YouTube videos: ', error);
        throw error;
    }
};

// Function to get video details by video ID
const getVideoDetails = async (req, res) => {
    try {
        const response = await youtube.videos.list({
            key: process.env.YOUTUBE_SECRETKEY,
            id: req.query.VedioId,
            part: 'snippet',
        });
        res.status(200).json({ success: true, message: "Vedio Found Successfully", data: response.data });

        // return response.data;
    } catch (error) {
        console.error('Error getting video details: ', error);
        throw error;
    }
};
const subscribeToChannel = async (req, res) => {
    try {
        const response = await youtube.subscriptions.insert({
            part: 'snippet',
            access_token: "ya29.a0AfB_byA6p_3gSbuIGoN56Ga2PLNlGbLxWRgZrhOAJkUmUJcYAa61O79GRAoJvqPR_DXJI5XWMnH8iz4TNl9i4zVfAgmBp4STDas1R78WFGF1-PYhzCpeY21r1R0hzAdQeIhNFWfJsUms44wh8fyYBRaSNpp9RVTCxC7LaCgYKAToSARASFQGOcNnCadog0x8uu_XtICD0eL6xsQ0171",
            resource: {
                snippet: {
                    resourceId: {
                        kind: 'youtube#channel',
                        channelId: req.query.channelId,
                    },
                },
            },
            // auth: 'Bearer' + "ya29.a0AfB_byA6p_3gSbuIGoN56Ga2PLNlGbLxWRgZrhOAJkUmUJcYAa61O79GRAoJvqPR_DXJI5XWMnH8iz4TNl9i4zVfAgmBp4STDas1R78WFGF1-PYhzCpeY21r1R0hzAdQeIhNFWfJsUms44wh8fyYBRaSNpp9RVTCxC7LaCgYKAToSARASFQGOcNnCadog0x8uu_XtICD0eL6xsQ0171", // Include your access token here
        });

        // Check the response to confirm the subscription
        if (response.status === 204) {
            res.send({ message: 'Subscribed successfully.', success: true });
        } else {
            res.send({ message: `Subscription failed:${response.statusText}`, success: false });
        }
    } catch (error) {
        res.send({ message: `Error subscribing to the channel:, ${error.message}`, success: false });
    }
};

const oauth2callback = async (req, res) => {
    console.log("Yes i am in")
    const code = req.query.code;
    console.log("🚀 ~ file: youtubeController.js:74 ~ oauth2callback ~ code:", code)

    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log("🚀 ~ file: youtubeController.js:80 ~ oauth2callback ~ tokens:", tokens)
        //   console.log("🚀 ~ file: youtubeController.js:78 ~ oauth2callback ~ tokens:", tokens)
        //   const decoded = jwt.verify(tokens.id_token, process.env.YOUTUBE_CLIENTID, { algorithms: ['RS256'] });
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.YOUTUBE_CLIENTID, // Your Google OAuth Client ID
        });
        const Googlepayload = ticket.getPayload();
        //  if(Googlepayload){
        //     const userModelData= await db.User.findOneAndUpdate({
        //         email:Googlepayload.email
        //     },{
        //         name:Googlepayload.name,
        //         email:Googlepayload.email,
        //         picture:Googlepayload.picture,
        //         youtube_AccessToken:tokens.access_token,
        //         youtube_RefreshToken:tokens.refresh_token,
        //       },{upsert:true,new:true})
        //       const payload = {
        //         userId: userModelData._id,
        //         email:userModelData.email
        //       };
        //       const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '300h' });
        //       const refresshtoken = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '660h' });
        //       const userModelDataafterToken= await db.User.updateOne(
        //         {_id:userModelData._id},
        //         {
        //        AccessToken:token,
        //        RefreshToken:refresshtoken
        //       },
        //       {upsert:true,new:true})
        //       if(userModelDataafterToken){
        //         res.status(200).json({ message: 'Login Successfully',success:true,AccessToken:userModelDataafterToken.AccessToken,RefreshToken:userModelDataafterToken.RefreshToken });
        //     }else{
        //         res.status(401).json({ message: 'Login Failed',success:false});
        //     }
        //  }else{
        //     res.status(401).json({ message: 'Login Failed Due to Your Information not found on Google',success:false});
        //  }
        // const credentialdata = admin.auth.GoogleAuthProvider.credential({
        //     accessToken: tokens.access_token,
        //     idToken: tokens.id_token,
        //   });
        //   console.log("🚀 ~ file: youtubeController.js:131 ~ oauth2callback ~ user:", user)
        //  let dataff=await admin.auth()
        //  console.log("🚀 ~ file: youtubeController.js:129 ~ oauth2callback ~ dataff:", dataff)
        //   res.send(`Authentication successful! You can now make API requests.===>${JSON.stringify(tokens)}`);
        // // const credential = admin.auth().GoogleAuthProvider.credential(null, tokens.id_token);
        // const userCredential = await admin.auth().signInWithCredential(credential);
        if (Googlepayload) {
            console.log("🚀 ~ file: youtubeController.js:128 ~ oauth2callback ~ Googlepayload:", Googlepayload)
            let useEmail = Googlepayload.email
            const checkUser = await firebasedb.collection('users').where('email', '==', useEmail).get();
            if (checkUser.empty) {
                const docRef = firebasedb.collection('users').doc();

                let data = await docRef.set({
                    email: Googlepayload.email,
                    name: Googlepayload.name,
                    photoURL: Googlepayload.picture,
                    accessToken: tokens.access_token,
                    coins: 0,
                    referrals: 0,
                    status: true,
                    // uid: user.uid,
                });
                const checkUserUpdatedUser = await firebasedb.collection('users').where('email', '==', Googlepayload.email).get();
                if (!checkUserUpdatedUser.empty) {
                    res.status(401).json({
                        message: 'Login Successfully', data: {
                            email: Googlepayload.email,
                            name: Googlepayload.name,
                            photoURL: Googlepayload.picture,
                            accessToken: tokens.access_token,
                        }, success: true
                    });
                } else {
                    res.status(401).json({ message: 'Login Failed', success: false });
                }

            } else {
                console.log("=================No User")
                res.status(401).json({
                    message: 'User Allready Created', data: {
                        email: Googlepayload.email,
                        name: Googlepayload.name,
                        photoURL: Googlepayload.picture,
                        accessToken: tokens.access_token,
                    }, success: true
                });

            }



        } else {
            res.status(401).json({ message: 'Login Failed Due to Your Information not found on Google', success: false });
        }

    } catch (error) {
        console.log("🚀 ~ file: youtubeController.js:125 ~ oauth2callback ~ error:", error)
        res.status(401).json({ message: error, success: false });
    }
};

function extractChannelID(url) {
    // Check if the URL matches the expected format
    const regex = /^https:\/\/www\.youtube\.com\/channel\/[a-zA-Z0-9_-]+$/;
    if (!regex.test(url)) {
        return false
    }

    // Split the URL using the "/" character and select the last part
    const channelID = url.split('/').pop();
    return channelID;
}

// Start the server

const Add_channel = async (req, res) => {
    try {
        const { url, NoOfSubsCribers, user_id } = req.body;
        // Check if the URL contains a YouTube channel ID
        if (extractChannelID(url) == false) {
            res.json({ success: false, message: 'Invalid youtube Url' });
        }
        const channelId = extractChannelID(url);
        console.log("🚀 ~ file: youtubeController.js:202 ~ constAdd_channel= ~ channelId:", channelId)
        const checkUser = await firebasedb.collection('users').doc(user_id).get()
        console.log("🚀 ~ file: youtubeController.js:217 ~ constAdd_channel= ~ checkUser:", checkUser)
        if (!checkUser._fieldsProto) {
            res.json({ success: false, message: 'No User Found' });
        }
        // Split the channel ID
        const docRef = firebasedb.collection('channel').doc();

        let data = await docRef.set({
            channel_id: channelId,
            No_Of_subscribers: NoOfSubsCribers,
            user_id: user_id
        });
        console.log("🚀 ~ file: youtubeController.js:213 ~ constAdd_Channel= ~ data:", data)
        // Return the result
        res.json({ success: true, message: 'Channel Added Successfully' });



    } catch (error) {

    }
}
const Get_channel = async (req, res) => {
    try {
        const {  id } = req.query;
  
      
        // Split the channel ID
        const docRef = await firebasedb.collection('channel').where('user_id', '==', id).get();
let list=[]
  if (docRef.empty) {
    console.log('No matching documents.');
    res.json({ success: false, message: 'No Channel Found', data:[]});

  } else {
    docRef.forEach((doc) => {
      const data = doc.data();
      console.log('Document data:', data);
      list.push(data)
    });
    res.json({ success: true, message: 'Channel Get Successfully', data:list});
  }
        console.log("🚀 ~ file: youtubeController.js:250 ~ constGet_channel= ~ docRef:", data)
        // Return the result
    } catch (error) {

    }
}

// Check if we have previously saved a token
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) {
//       getAccessToken(oauth2Client);
//     } else {
//       oauth2Client.credentials = JSON.parse(token);
//       // You now have the access token in oauth2Client
//     }
//   });

async function loginWithYoutube(req, res) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    // res.send(`🚀 ~ file: youtubeController.js:144 ~ loginWithYoutube ~ authUrl:${authUrl}`)
    res.send({ Url: authUrl });
    // res.writeHead(301, { "Location": authUrl });
}
// Export the controller functions
module.exports = {
    searchYouTubeVideos,
    getVideoDetails,
    subscribeToChannel,
    oauth2callback,
    loginWithYoutube,
    Add_channel,
    Get_channel
};
