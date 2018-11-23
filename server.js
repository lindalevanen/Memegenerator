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

/* To handle file upload */
const mult = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10Mb.
  }
});

/* FB initialization (Admin) */
var admin = require("firebase-admin");
//var serviceAccount = require("./keys/memegenerator-cbece-firebase-adminsdk-gou1g-0bc5b29c41.json");

admin.initializeApp({
  credential: admin.credential.cert({
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://memegenerator-cbece.firebaseio.com",
  storageBucket: "memegenerator-cbece.appspot.com"
})*/

/* Reference to storage */
const bucket = admin.storage().bucket();
/* Reference to Database */
var db = admin.database();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser())

/* Create a meme with userId and a private tag */

app.post('/createMeme', mult.single('image'), function(req, res){
  const memeFile = req.file
  const { userId, priva } = req.body
  if(memeFile) {
    const postRef = db.ref('/posts').push()
    const postId = postRef.key

    uploadImageToStorage(memeFile, postId).then((data) => {
      if(priva) { // if the user wants the post to be private, lets not save it in the db, just in storage
        res.status(200).json({
          status: 'success',
          message: {
            url: data.url
          }
        });
      } else {
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
      }

      
    }).catch((error) => {
      console.error(error);
    });
  }
})

/*app.post('/voteMeme', function(req, res) {
  const { key, amount, uid } = req.body
  const userRef = db.ref('/userData/'+uid)

  userRef.once("value", function(snapshot) {  // check that user is found from our DB
    const user = snapshot.val()
    if(user) {
      const userVoteRef = db.ref('voteData/' + uid)
      userVoteRef.once('value', function(snapshot) { 
        const u = snapshot.val()
        if(u && u[key]) {  // The user has already voted on this post
          if(u[key] == amount) { // if the user tries downvotes or upvotes twice, remove the vote
            const voteRef = userVoteRef.child(key);
            voteRef.remove().then(function() {
              changeVoteAmount(key, amount * -1)  // if the user click the same vote again, remove the previous vote
              console.log("Voting success")
              res.status(200).json({
                status: 'success',
                voteChange: amount * -1,
                message: 'Vote deleted successfully'
              });
            }).catch(function(error) {
              console.log(error)
              res.status(500).json({
                status: 'error',
                message: 'Deleting of vote failed.'
              });
            });
          } else {  // The user has changed it's mind from upvote to downvote or other way
            console.log("voting success")
            userVoteRef.set({
              [key]: amount
            });
            changeVoteAmount(key, amount * 2)
            res.status(200).json({
              status: 'success',
              voteChange: amount * 2,
              message: 'Voting successful'
            });
          }
        } else {  // The user hasn't voted on this post 
          userVoteRef.set({
            [key]: amount
          });
          changeVoteAmount(key, amount)
          console.log("Voting success")
          res.status(200).json({
            status: 'success',
            voteChange: amount,
            message: 'Voting successful'
          });
        }
      })
    } else {
      console.log("Cound not find user: " + errorObject.code);
      res.status(400).json({
        status: 'error',
        message: 'Cound not find user'
      });
    }
  }), function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    res.status(500).json({
      status: 'error',
      message: 'Cound not connect to DB'
    });
  };
})

const changeVoteAmount = (key, amount) => {
  console.log("changevoteamount")
  const postRef = db.ref('/posts/'+key)
  postRef.transaction(function(post) {
    if (post) {
      console.log("upvoting post...")
      post.voteCount += amount
    } else {
      console.log("Post not found...")
    }
    return post;
  });
}*/

/* Get the next 5 memes of with order that's either new or old */

app.post('/memeList', function(req, res) {
  let posts = db.ref('/posts').orderByChild("uploadTime").limitToLast(5)
  const { order } = req.body

  switch (order) {
    case "new":
      posts = db.ref('/posts').orderByChild("uploadTime").limitToLast(5)
      break;
    case "old":
      posts = db.ref('/posts').orderByChild("uploadTime").limitToFirst(5)
      break;
    default:
      break;
  }

  posts.once("value", function(snapshot) {
    const data = snapshot.val()
    if(data) {
      /* Lets change the data to be in an array, with an id attribute so it's more easily sorted in front */
      var parsedData = Object.keys(data).map(function(key) {
        return {...data[key], id: key};
      });
      /* Firebase won't sort by descending for us, so lets do it here */
      if(order === "new") {
        parsedData = parsedData.reverse()
      }
      res.status(200).json({
        status: 'success',
        data: parsedData
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Data not found'
      });
    }
  }, function (errorObject) {
    res.status(500).json({
      status: 'error',
      message: 'Cound not connect to DB'
    });
    console.log("The read failed: " + errorObject.code);
  });
})

/* Get the next 5 memes of the order that's being used, with the help of the last post shown */

app.post('/moreMemes', function(req, res) {
  const { order, lastPostId, lastPostVal } = req.body
  if(order == null || lastPostId == null) {
    res.status(400).json({
      status: 'error',
      message: 'Order or last post id null'
    });
    return;
  }

  let posts = null
  switch (order) {
    case "new":
      posts = db.ref('/posts').orderByChild("uploadTime").endAt(lastPostVal, lastPostId).limitToLast(6)
      break;
    case "old":
      posts = db.ref('/posts').orderByChild("uploadTime").startAt(lastPostVal, lastPostId).limitToFirst(6)
      break;
    default:
      break;
  }

  if(posts) {
    posts.once("value", function(snapshot) {
      const data = snapshot.val()
      if(data) {
        /* Lets change the data to be in an array, with an id attribute so it's more easily sorted in front */
        var parsedData = Object.keys(data).map(function(key) {
          return {...data[key], id: key};
        });
        /* Firebase won't sort by descending for us, so lets do it here */
        if(order === "new") {
          parsedData = parsedData.reverse()
        }
        /* Firebase includes the ending element in endAt
           which is the last element in the meme list we already have, so lets remove that */
        parsedData.shift()

        res.status(200).json({
          status: 'success',
          data: parsedData
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Data not found'
        });
      }
    }, function (errorObject) {
      res.status(500).json({
        status: 'error',
        message: 'Cound not connect to DB'
      });
      console.log("The read failed: " + errorObject.code);
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Order must be either new or old'
    });
    return;
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
  var ref = db.ref("posts/" + postId);

  ref.on("value", function(snapshot) {
    const data = snapshot.val()
    if(data) {
      //const file = bucket.file('memeImages/' + postId);

      res.redirect(data.imageUrl);


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
      }*/

    /*} else {
      res.status(400).send({message: "Meme not found."});
    }
    
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});*/


app.listen(port, () => console.log(`Listening on port ${port}`));
