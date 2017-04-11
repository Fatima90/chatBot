
module.exports=function(app,express){
	app.get('/auth/facebook/callback',function(req,res){
		console.log("its a request");
		res.status(200).send();
	})
}