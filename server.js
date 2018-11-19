const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser')
const Multer  = require('multer')
const UUID = require("uuid-v4");

// Serve any static files
app.use(express.static(path.join(__dirname, "client/build")));


if (process.env.NODE_ENV === "production") {
  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  })
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* To handle file upload */
const mult = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10Mb.
  }
});

/* FB initialization (Admin) */
var admin = require("firebase-admin");
var serviceAccount = require("./keys/memegenerator-cbece-firebase-adminsdk-gou1g-1cf401ab0d.json");

admin.initializeApp({
  credential: admin.credential.cert({
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  /*databaseURL: "https://memegenerator-cbece.firebaseio.com",
  storageBucket: "memegenerator-cbece.appspot.com"*/
});

/* Reference to storage */
const bucket = admin.storage().bucket();
/* Reference to Database */
var db = admin.database();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser())

app.post('/createMeme', mult.single('image'), function(req, res){
  const memeFile = req.file
  const { userId, priva } = req.body
  if(memeFile) {
    const postRef = db.ref('/posts').push()
    const postId = postRef.key

    uploadImageToStorage(memeFile, postId).then((data) => {
      const postData = {
        imageUrl: data.url,
        uploadTime: data.time,
        voteCount: 0,
        private: priva
      }
      if(userId) {
        postData.userId = userId
      }

      postRef.set(postData, function(error) {
        if (error) {
          res.status(500).send({
            status: "error",
            message: error
          });
        } else {
          res.status(200).json({
            status: 'success',
            message: {
              url: data.url
            }
          });
        }
      });
    }).catch((error) => {
      console.error(error);
    });
  }
})

/**
 * FROM: https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file, postId) => {
  const promise = new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    const currentTime = Date.now();
    const fileUpload = bucket.file("memeImages/"+postId);
    const uuid = UUID();

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      }
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      const data = {
        //url: `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`,
        url: "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(fileUpload.name) + "?alt=media&token=" + uuid,
        time: currentTime
      }
      resolve(data);
    });

    blobStream.end(file.buffer);
  });
  return promise;
}

/*app.get('/meme/:postId', function(req, res) {
  const postId = req.params.postId
  console.log("postId:")
  console.log(postId)
  var ref = db.ref("posts/" + postId);

  ref.on("value", function(snapshot) {
    const data = snapshot.val()
    if(data) {
      const file = bucket.file('memeImages/' + postId);

      /*const ref = admin.storage().ref().child('memeImages/' + postId)

      ref.getDownloadURL().then(function(url) {
        console.log(url);
      }).catch(function(error) {
        console.log(error)
      });*/
      /*if(file) {
        file.getSignedUrl({
          action: 'read',
          expires: '03-09-2400'
        }).then(signedUrls => {
            //res.writeHead(200, {'Content-Type': 'text/html'});
            //res.write('<html><body><img src="')
            //res.write(signedUrls[0])
            //res.end('"/></body></html>');

            console.log('signed URL', data.imageUrl); // this will contain the picture's url
            res.status(200).render('memeImage.html', {url: data.imageUrl})
            //res.status(200).render(signedUrls[0])
        });
      } else {
        res.status(400).send({message: "Meme not found."});
      }

    } else {
      res.status(400).send({message: "Meme not found."});
    }
    
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});*/


app.listen(port, () => console.log(`Listening on port ${port}`));
