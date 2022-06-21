const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'banner',
	description: 'Display the banner of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to display.',
		type: ApplicationCommandOptionType.User,
		required: false
	}, {
		name: 'color',
		description: "Display user's banner color.",
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}],
	dm_permission: true
};
