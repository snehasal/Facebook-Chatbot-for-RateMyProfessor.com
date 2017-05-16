'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
var sender
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        sender = event.sender.id 
        if (event.message && event.message.text) {
            let text = event.message.text
            if(text == "help")
            {
                sendTextMessage(sender, "Enter Professor Name");
                continue;
            }
            if(text == "hi")
            {
                sendTextMessage(sender, "Hello! Please Enter Professor Name");
                continue;
            }
            
            
                rateProf(text)
                //sendGenericMessage(sender)
                
                //rmp.get(sender,"Paul Lynch", callback);
                continue
            
            //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

const token = "EAAIcyG8o36gBAPbKg4l7RGnUZC3nbgxI2kBwkDUqsfjZCHj2LnD3P5w0EG5C12C2SVqnVqrPTHu6VTBKcsUNQJCurIyMpGY3ermsZBAJoSW7F8yPltcNOw5ZBV70sg9o72qgPgtuHCScHPIOtPZBLDGLh8ucEdVp0nCikr4dEOAZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

var rmp = require("rmp-api");

function rateProf(prof){
    



var callback = function(professor) {
  if (professor === null) {
    console.log("No professor found.");

    sendTextMessage(sender, "Not Found")
    return;
  }
  console.log("Name: " + professor.fname + " " + professor.lname);
  console.log("University: "+ professor.university);
  console.log("Quality: " + professor.quality);
  console.log("Easiness: " + professor.easiness);
  console.log("Helpfulness: " + professor.help);
  console.log("Average Grade: " + professor.grade);
  console.log("Chili: " + professor.chili);
  console.log("URL: " + professor.url);
  console.log("First comment: " + professor.comments[0]);

  sendTextMessage(sender, "Name: " + professor.fname + " " + professor.lname)
  
  ++sendTextMessage(sender, "Quality: " + professor.quality)
  sendTextMessage(sender, "URL: " + professor.url)
  sendTextMessage(sender, "Helpfulness: " + professor.help)
  
  
};

rmp.get(prof, callback);
}