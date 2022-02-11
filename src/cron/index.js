const schedule = require('node-schedule');

const live = require('./live');

async function register() {
	// At every minute.
	schedule.scheduleJob('* * * * *', function() {
		if (!global.client.isReady) return;

		live.checkForStreams();
	});

	// At 05:00 on Wednesday.
	schedule.scheduleJob('0 5 * * 3', function() {
		if (!global.client.isReady) return;

		live.cleanup();
	});
}

module.exports.run = register;
