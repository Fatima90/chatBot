var express=require('express');
var app=express();
var morgan=require('morgan');
var bodyParser=require('body-parser');

var port= process.env.PORT || 8080;

app.listen(port,function(){
	console.log('app is listening')
})