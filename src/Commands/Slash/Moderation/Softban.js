import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['softban'],
			description: 'Softban a user. (Bans and unbans to clear up the user\'s messages.)',
			memberPermissions: ['BanMembers'],
			clientPermissions: ['BanMembers']
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user', true);
		const reason = await interaction.options.getString('reason');
		const days = await interaction.options.getInteger('days') || 1;

		if (user.id === interaction.user.id) return interaction.reply({ content: `You can't ban yourself.`, ephemeral: true });
		if (user.id === this.client.user.id) return interaction.reply({ content: `You cannot ban me!`, ephemeral: true });

		const member = interaction.guild.members.cache.get(user.id);
		if (member && member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot ban a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (member && !member.bannable) return interaction.reply({ content: `I cannot ban a member who has a higher or equal role than mine.`, ephemeral: true });

		await interaction.guild.members.ban(user, { deleteMessageDays: days, reason: `${reason ? `${reason} (Softbanned by ${interaction.user.tag})` : `(Softbanned by ${interaction.user.tag})`}` });
		await interaction.guild.members.unban(user, `${reason ? `${reason} (Softbanned by ${interaction.user.tag})` : `(Softbanned by ${interaction.user.tag})`}`);

		return interaction.reply({ content: [
			`**${user.tag}** was softbanned!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });
	}

}