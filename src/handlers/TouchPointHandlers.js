'use strict';

var ts = require('../services/TouchPointService');
var TouchPointService = new ts();
var UUID = require('uuid');

module.exports.getQuotes = async (event, context) => {
	return {
		statusCode: 200,
		body: JSON.stringify(await TouchPointService.getAll()),
	};
};

module.exports.getQuote = async (event, context) => {
	const id = event.pathParameters.id;
	const data = await TouchPointService.get(id);
	console.log('Data', data);
	if (!data) {
		return { statusCode: 404 };
	}
	return {
		statusCode: 200,
		body: JSON.stringify(await TouchPointService.get(id)),
	};
};

module.exports.updateQuote = async (event, context) => {
	const id = event.pathParameters.id;
	const oldQuote = await TouchPointService.get(id);
	console.log('oldQuote', oldQuote);
	if (!oldQuote) {
		return { statusCode: 404 };
	}
	let data = JSON.parse(event.body);
	return {
		statusCode: 200,
		body: JSON.stringify(await TouchPointService.update(id, data)),
	};
};

module.exports.createQuote = async (event, context) => {
	let data = JSON.parse(event.body);
	data.id = UUID.v4();
	const newQuote = await TouchPointService.create(data);
	if (!newQuote) {
		return { statusCode: 500 };
	}
	return {
		statusCode: 201,
		body: JSON.stringify(await TouchPointService.create(data)),
	};
};
