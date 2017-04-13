var request=require('request');
var dataFile=require('./data.json');

module.exports=function(app,express){
	app.get('/auth/facebook/callback', function(req, res) {
	  if (req.query['hub.mode'] === 'subscribe' &&
	      req.query['hub.verify_token'] === "rebootkamp") {
	    console.log("Validating webhook");
	    res.status(200).send(req.query['hub.challenge']);
	  } else {
	    console.error("Failed validation. Make sure the validation tokens match.");
	    res.sendStatus(403);          
	  }  
	});

	app.post('/auth/facebook/callback', function (req, res) {
	  var data = req.body;
console.log('data entry',data)
	  // Make sure this is a page subscription
	  if (data.object === 'page') {

	    // Iterate over each entry - there may be multiple if batched
	    data.entry.forEach(function(entry) {
		console.log('data entry in for loop', entry)	    	
	      var pageID = entry.id;
	      var timeOfEvent = entry.time;

	      // Iterate over each messaging event
	      entry.messaging.forEach(function(event) {
	        if (event.message) {
	          receivedMessage(event);
	        } else {
	          console.log("Webhook received unknown event: ", event);
	        }
	      });
	    });

	    // Assume all went well.
	    //
	    // You must send back a 200, within 20 seconds, to let us know
	    // you've successfully received the callback. Otherwise, the request
	    // will time out and we will keep trying to resend.
	    res.sendStatus(200);
	  }
	});
}


 
	function receivedMessage(event) {
	  var senderID = event.sender.id;
	  var recipientID = event.recipient.id;
	  var timeOfMessage = event.timestamp;
	  var message = event.message;

	  console.log("Received message for user %d and page %d at %d with message:", 
	    senderID, recipientID, timeOfMessage);
	  //console.log(JSON.stringify(message));

	  var messageId = message.mid;

	  var messageText = message.text;
	  var messageAttachments = message.attachments;

	  if (messageText) {

	  	var text=checkMessage(messageText);
	  	sendTextMessage(senderID, text);
	    // If we receive a text message, check to see if it matches a keyword
	    // and send back the example. Otherwise, just echo the text we received.
	  //   switch (messageText) {
	     

	  //      case 'generic':
	  //       sendGenericMessage(senderID);
	  //       break;

	  //      case 'steps':
	  //      sendStepsMessage(senderID);
	  //      break;

	  //      case 'hello':
	  //      case 'question':
	  //      case 'want':
	  //      callSendAPI(sendTextMessage(senderID,"welcom to RBK, we will answer your questions"))
			// break;

	  //     default:
	  //       sendTextMessage(senderID, messageText);
	  //   }
	  } else if (messageAttachments) {
	    sendTextMessage(senderID, "Message with attachment received");
	  }
	}
	
	function sendTextMessage(recipientId, messageText) {
	  var messageData = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      text: messageText
	    }
	  };
  	
  	 callSendAPI(messageData);
	}
	
	function callSendAPI(messageData) {
	  request({
	    uri: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: { access_token: "EAAND1xDzMrYBAIy7WKt7IbEqWuCgxB6QWxWZBp8IaLy2ZAGPqaZArhyhKHHKq8zuZCuhBru5TqT3G2mWpk7r8Ebn2ZBerDmbsiE0w7VX0LfEMk3mmcwaTuo9aBpEtT5pYm2YtBZAV0Ml0r8kFJ2dam9jB95AhhXtUuZBxomywWtCgZDZD" },
	    method: 'POST',
	    json: messageData

	  }, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      var recipientId = body.recipient_id;
	      var messageId = body.message_id;

	      console.log("Successfully sent generic message with id %s to recipient %s", 
	        messageId, recipientId);
	    } else {
	      console.error("Unable to send message.");
	      console.error(response);
	      console.error(error);
	    }
  		});  
	}

	function sendGenericMessage(recipientId, messageText) {
 	 // To be expanded in later sections
 	 var messageData = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      attachment: {
	        type: "template",
	        payload: {
	          template_type: "generic",
	          elements: [{
	            title: "rift",
	            subtitle: "Next-generation virtual reality",
	            item_url: "https://www.oculus.com/en-us/rift/",               
	            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
	            buttons: [{
	              type: "web_url",
	              url: "https://www.oculus.com/en-us/rift/",
	              title: "Open Web URL"
	            }, {
	              type: "postback",
	              title: "Call Postback",
	              payload: "Payload for first bubble",
	            }],
	          }, {
	            title: "touch",
	            subtitle: "Your Hands, Now in VR",
	            item_url: "https://www.oculus.com/en-us/touch/",               
	            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
	            buttons: [{
	              type: "web_url",
	              url: "https://www.oculus.com/en-us/touch/",
	              title: "Open Web URL"
	            }, {
	              type: "postback",
	              title: "Call Postback",
	              payload: "Payload for second bubble",
	            }]
	          }]
	        }
	      }
	    }
	  };  

	  callSendAPI(messageData);
}


function sendStepsMessage(recipientId, messageText) {
 	 // To be expanded in later sections
 	 var messageData = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      attachment: {
	        type: "template",
	        payload: {
	          template_type: "generic",
	          elements: [{
	            title: "Step 1",
	            subtitle: "Visit RBK WebSite",
	            item_url: "https://www.rbk.org",               
	            image_url: "http://rbk.org/wp-content/uploads/2016/03/znewlogo.png",
	            buttons: [{
	              type: "web_url",
	              url: "https://www.rbk.org",
	              title: "Open RBK website"
	            }],
	          }, {
	            title: "Step 2",
	            subtitle: "Click on Apply for next class button",
	            item_url: "https://www.rbk.org",               
	            image_url: "http://i.imgur.com/iB4Y66U.png"
	          },
	          {
	            title: "Step 3",
	            subtitle: "keep track of Your Email for The next step",
	            item_url: "http://i.imgur.com/XwPNAY4.png",               
	            image_url: "http://i.imgur.com/XwPNAY4.png"
	          },
	          {
	            title: "Step 4",
	            subtitle: "Fill The Applications",
	            item_url: "http://i.imgur.com/OlXwIUm.png",
	            image_url: "http://i.imgur.com/OlXwIUm.png"               
	          }]
	        }
	      }
	    }
	  };  

	  callSendAPI(messageData);
}

function checkMessage(text){
	var arr=text.toLowerCase().split(' ');
	var results=[];
	for(var i=0; i< arr.length; i++){
		if ( dataFile[arr[i]] ){
			results.push(dataFile[arr[i]]);
		}
	}
	return results.join();
}

console.log(checkMessage("is it FREE or do i pay Tuition"))