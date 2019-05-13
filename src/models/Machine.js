const mongoose = require('mongoose');
const { Schema } = mongoose;

const Machine = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Machine', Machine);