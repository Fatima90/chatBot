var request=require('request');
var englishData=require('./englishData.json');
var arabicData=require('./arabicData.json')
var _ = require('underscore-node');

module.exports=function(app,express){
	app.get('/auth/facebook/callback', function(req, res) {
	  if (req.query['hub.mode'] === 'subscribe' &&
	      req.query['hub.verify_token'] === "rebootkamp") {
	    res.status(200).send(req.query['hub.challenge']);
	  } else {
	    console.error("Failed validation. Make sure the validation tokens match.");
	    res.sendStatus(403);          
	  }  
	});


	app.post('/auth/facebook/callback', function (req, res) {
	  var data = req.body;
	  // Make sure this is a page subscription
	  if (data.object === 'page') {

	    // Iterate over each entry - there may be multiple if batched
	    data.entry.forEach(function(entry) {
	      var pageID = entry.id;
	      var timeOfEvent = entry.time;

	      // Iterate over each messaging event
	      entry.messaging.forEach(function(event) {
	        console.log("in looooooooop",event)
	        if (event.message) {
	          receivedMessage(event);
	        }else if (event.postback) {
	        	console.log('in the postback')
          		processPostback(event);
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
	  	if(!text){
	  		sendTextMessage(senderID, "I didn't get the question, please rephrase it again");
	  	}else{
	  		sendTextMessage(senderID, text);	  		
	  	}
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

	function processPostback(event) {
	  var senderId = event.sender.id;
	  var payload = event.postback.payload;

	  if (payload === "Greeting") {
	    // Get user's first name from the User Profile API
	    // and include it in the greeting
	    request({
	      url: "https://graph.facebook.com/v2.6/" + senderId,
	      qs: {
	        access_token: "EAAND1xDzMrYBAIy7WKt7IbEqWuCgxB6QWxWZBp8IaLy2ZAGPqaZArhyhKHHKq8zuZCuhBru5TqT3G2mWpk7r8Ebn2ZBerDmbsiE0w7VX0LfEMk3mmcwaTuo9aBpEtT5pYm2YtBZAV0Ml0r8kFJ2dam9jB95AhhXtUuZBxomywWtCgZDZD",
	        fields: "first_name"
	      },
	      method: "GET"
	    }, function(error, response, body) {
	      var greeting = "";
	      if (error) {
	        console.log("Error getting user's name: " +  error);
	      } else {
	        var bodyObj = JSON.parse(body);
	        name = bodyObj.first_name;
	        greeting = "Hi " + name + ". ";
	      }
	      var message = greeting + "My name is RBK chatbot, and I will answer your questions. أهلا وسهلا بك,أنا هو المتحدث الأوتماتيكي وسوف أقوم بلإجابة على جميع استفسارتك.";
	      sendTextMessage(senderId, message);
	    });
	  }
	}


	function checkMessage(text){
		var lang=/[\u0590-\u06FF]/.test(text);
		var arr=text.toLowerCase().split(' ');
		var results=[];
		var data= (lang ? arabicData : englishData);
		if( text.toLowerCase().indexOf("what is rbk") > 0 ){
			return "We are the first code bootcamp in the Arab world. Silicon Valley based Hack Reactor, the leading code bootcamp in the United States, is a cofounding partner and provides the curricula.";
		}else if(text.toLowerCase().indexOf("how are you") > 0 ){
			return "Great, How can the I help? please ask me any question you have!"
		}		
		for(var i=0; i< arr.length; i++){
			if ( data[arr[i]] ){
				results.push(data[arr[i]]);
			}
		}

		return _.uniq(results).join();
	}

console.log(checkMessage("something"))