const schedule = require('node-schedule');

const live = require('./live');
const botChannel = require('./botChannel');

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

	// At minute 0 past every 12th hour.
	schedule.scheduleJob('0 */12 * * *', function() {
		if (!global.client.isReady) return;

		botChannel.clear();
	});
}

module.exports.run = register;
