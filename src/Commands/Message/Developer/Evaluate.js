const Command = require('../../../Structures/Command');
const { AttachmentBuilder, codeBlock, inlineCode } = require('discord.js');
const { Type } = require('@anishshobith/deeptype');
const { inspect } = require('node:util');
const { Emojis } = require('../../../Utils/Constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'evaluate',
			aliases: ['eval'],
			description: 'Evaluating javascript language code.',
			category: 'Developer',
			usage: '[code]',
			ownerOnly: true
		});
	}

	async run(message, args) {
		if (!args.length) return message.reply({ content: `Please enter the javascript code that will be evaluated.` });
		let code = args.join(' ');
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaled;
		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}
			const stop = process.hrtime(start);
			const response = [
				`${codeBlock('js', this.clean(inspect(evaled, { depth: 0 })))}\n`,
				`${Emojis.Info} ${inlineCode(new Type(evaled).is)} `,
				`${Emojis.Alarm} ${inlineCode(`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms`)}`
			].join('');
			if (response.length < 2e3) {
				return message.channel.send({ content: response });
			} else {
				const attachment = new AttachmentBuilder()
					.setFile(Buffer.from(this.clean(inspect(evaled, { depth: 0 }))))
					.setName('output.txt');

				return message.channel.send({ files: [attachment] });
			}
		} catch (error) {
			return message.reply({ content: `**Error:** ${codeBlock('xl', this.clean(error))}` });
		}
	}

	clean(content) {
		if (typeof content !== 'string') return content;
		const cleaned = content
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(new RegExp(this.client.token, 'gi'), 'NO-TOKEN');
		return cleaned;
	}

};
