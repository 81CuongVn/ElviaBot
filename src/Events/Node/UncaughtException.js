const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'uncaughtException',
			emitter: process
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(error, origin) {
		this.client.logger.error(error.stack);
	}

};
