const mongoose = require('mongoose');
const { Schema } = mongoose;

const Status = new Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Status', Status);