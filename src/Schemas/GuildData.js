const { Schema, model: Model } = require('mongoose');

module.exports = class GuildData extends Model {

	constructor() {
		super('Guild', new Schema({
			id: { type: String },
			membersData: { type: Object, default: {} },
			members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
			plugins: { type: Object, default: {
				warnsSanctions: {
					kick: false,
					ban: false
				},
				moderations: false,
				reports: false,
				logs: false
			} },
			casesCount: { type: Number, default: 0 }
		}));
	}

};
