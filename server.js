var express=require('express');
var app=express();
var morgan=require('morgan');
var bodyParser=require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var port= process.env.PORT || 8080;

require('./routes.js')(app,express);

app.listen(port,function(){
	console.log('app is listening')
})