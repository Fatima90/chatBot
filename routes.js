
module.exports=function(app,express){

	// app.get('/auth/facebook/callback',function(req,res){
	// 	console.log("its a request 1");
	// 	res.status(200).send();
	// })

	// app.get('/auth/facebook/callback/:verify_token',function(req,res){
	// 	console.log(req.params);
	// 	var token="rebootkamp"
	// 	if(req.params.verify_token === token
	// 		res.status(200).send(req.params.hubmode);
	// 	}else{
	// 		res.status(500).send();
	// 	}
	// })

	app.get('/auth/facebook/callback/:verify_token',function(req,res){
		var token="rebootkamp"
		console.log(req.params.verify_token);
		if(req.params.verify_token === token){
			console.log('verifed');
			res.status(200).send();
		}else{
			res.status(500).send("crash");
		}
	})

	// app.get('/auth/facebook/callback/:hub.challenge',function(req,res){
	// 	console.log("its a request 2");
	// 	res.status(200).send();
	// })

	// app.get('/auth/facebook/callback/:hub.verify_token',function(req,res){
	// 	var token="rebootkamp";
	// 	console.log(req.params);

	// 	res.status(200).send();
	// })
}