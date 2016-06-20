'use strict';

const express = require('express');
const http = require('http');

const app = express();

app.get('*', function(req,res, next){
	const urlQuery = req.url;
	const query = urlQuery.slice(1);
	let isDate = isQueryaDate(query);
	if(!isDate){
		let isUnix = isQueryUnix(query);
		if(!isUnix){
			res.end('This is not a valid date!');
		}else{
			let dateTranslation = translateToDate(query);
			res.json({unix : parseInt(query),
				natural : dateTranslation});
			res.end();
		}
	}else{
		let properDate = getProperDate(isDate);
		let unixTranslation = translateToUnix(isDate);
		res.json({unix : unixTranslation, 
			natural : properDate});
		res.end();
	}
	res.end();
	next();
});

app.listen(3000);


function getProperDate(query){
	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	let month  = months[query.getMonth()];
	let day = query.getDate();
	let year = query.getFullYear();
	return month + ' ' + day + ' ,' + year;
}

function isQueryaDate(query){
	let re = /%20/gi;
	let noSpace = query.replace(re, ' ');
	let queryAsDate = new Date(noSpace);
	if(queryAsDate == 'Invalid Date'){
		return false;
	}else{
		return queryAsDate;
	}
}

function isQueryUnix(query){
	let unixDate = new Date(query*1000);
	if(unixDate == 'Invalid Date'){
		return false;
	}else{
		return true;
	}
}

function translateToUnix(query){
	let unixTime = Date.parse(query)/1000;
	return unixTime;
}

function translateToDate(query){
	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	let unixDate = new Date(query*1000);
	let year = unixDate.getFullYear();
	let month = months[unixDate.getMonth()];
	let day = unixDate.getDate();
	return month + ' ' + day + ' ,' + year;
}