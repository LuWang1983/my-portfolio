const path = require('path')
if (process.env.NODE_ENV !== 'production') require('dotenv').config({ path: path.resolve(__dirname, './.env') })

const firebase = require('firebase');
// more efficient to require the services instead the whole SDK in production
require('firebase/firestore');
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
console.log(db)

module.exports = db
