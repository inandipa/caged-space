'use strict';

var firebase = require("firebase");

module.exports.addStream = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let newKey = firebase.database().ref('streams').push().key;

  let stream = JSON.parse(event.body);
  stream.id = newKey;

  var updates = {};
  updates['/streams/' + newKey] = stream;

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref('streams/' + newKey).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Stream Created',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};

module.exports.updateStream = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let key = JSON.parse(event.body).id;

  var updates = {};
  updates['/streams/' + key] = JSON.parse(event.body);

  firebase.database().ref().update(updates).then(function () {

    firebase.database().ref('streams/' + key).once('value').then(function (snapshot) {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
        },
        body: JSON.stringify({
          message: 'Stream Updated',
          data: snapshot.val()
        })
      };

      callback(null, response);

    });

  });

};


module.exports.deleteStream = (event, context, callback) => {

context.callbackWaitsForEmptyEventLoop = false;  //<---Important

  // Initialize Firebase
  initializeFirebase();

  let key = JSON.parse(event.body).id;
  
  firebase.database().ref('streams/' + key).remove();  //<---- Firebase Delete Query

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
    },
    body: JSON.stringify({
      message: 'Stream Deleted',
      data: event.body
    }),
  };

  callback(null, response);

};


let initializeFirebase = function () {

  let firebaseConfig = {
    apiKey: "AIzaSyAgvU-ZNdAMYJaw_kTK-uyWMIGHwCZtmMM",
    authDomain: "cagedspace-9d75f.firebaseapp.com",
    databaseURL: "https://cagedspace-9d75f.firebaseio.com",
    storageBucket: "cagedspace-9d75f.appspot.com",
    messagingSenderId: "464147072174"
  };

  if (firebase.apps.length == 0) {   // <---Important!!! In lambda, it will cause double initialization.

    firebase.initializeApp(firebaseConfig);

  }

} 
