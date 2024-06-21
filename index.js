// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = 3001;
// const { decryptToString } = require('./secure-file.js') 
// const secureFileName = './credentials.json.secure'
// const jsonStr = decryptToString(secureFileName)
// const serviceAccount = JSON.stringify(jsonStr);

// const cert = admin.credential.cert({
//     projectId: params.projectId,
//     clientEmail: params.clientEmail,
//     privateKey,
// })


//Firebase Admin Service Account
const serviceAccount = require('./credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var claim = {
    control: true
}

// CORS Configuration
app.use(cors());
app.options("", cors());
app.use(function (req, res, next) 
{
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, X-CallbackType, Content-Type, Accept");
      res.header("Cache-Control", "no-cache");
      if ("OPTIONS" == req.method) 
      {
          res.send(200);
      }
      else 
     {
       next();
     }
});

// Express Configuration
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Dotenv Configuration
dotenv.config();


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


// Main function that gets and processes the token generation based on the provided user ID
app.get('/:uid', async(req, res) => {
    console.log(req.params)
    try {
        const uid = req.params.uid
        await admin.auth().createCustomToken(uid, claim).then((customToken) => {
            console.log("CusToken: " + customToken)
            return res.status(200).json(customToken);
        })
    } catch (error) {
        console.error('Error creating custom token:', error.message);
    }
})
