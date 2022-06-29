import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'lovecalc',
	description: 'Calculate love percentage between two users.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: '1st',
		description: '1st user.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: '2nd',
		description: '2nd user.',
		type: ApplicationCommandOptionType.User,
		required: true
	}],
	dm_permission: false
};
