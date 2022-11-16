import * as mongoose from 'mongoose';
import { AccountInterface } from '../interfaces/account.interface';

const AccountSchema = new mongoose.Schema({
    email: { type: String, trim: true, unique: true, required: true },

}, { versionKey: false });

AccountSchema.set('collection', 'Account');

const accountSchema = mongoose.model<AccountInterface & mongoose.Document>('Account', AccountSchema);

export default accountSchema;