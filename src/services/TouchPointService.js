var AWS = require('aws-sdk');

class TouchPointService {
	constructor() {
		let dbconfiguration = process.env.IS_OFFLINE
			? {
					region: 'localhost',
					endpoint: 'http://localhost:8000',
			  }
			: {};
		this.dynamo = new AWS.DynamoDB.DocumentClient(dbconfiguration);
	}

	async get(id) {
		let params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				id: id,
			},
		};
		return new Promise((resolve, reject) => {
			this.dynamo.get(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data.Item);
				}
			});
		});
	}

	async getAll() {
		let params = {
			TableName: process.env.TABLE_NAME,
		};
		return new Promise((resolve, reject) => {
			this.dynamo.scan(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data.Items);
				}
			});
		});
	}

	async create(item) {
		let data = {
			TableName: process.env.TABLE_NAME,
			Item: item,
		};
		return new Promise((resolve, reject) => {
			this.dynamo.put(data, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(item);
				}
			});
		});
	}

	async update(id, item) {
		let oldItem = await this.get(id);
		if (!oldItem) {
			return null;
		}
		item.id = id;
		item = { ...oldItem, ...item };
		let params = {
			TableName: process.env.TABLE_NAME,
			Item: item,
			ReturnValues: 'ALL_OLD',
		};
		return new Promise((resolve, reject) => {
			this.dynamo.put(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
}

module.exports = TouchPointService;
