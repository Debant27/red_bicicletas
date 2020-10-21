var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TokenSchema = new Schema({
    _userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

module.exports = mongoose.model('Token',TokenSchema);