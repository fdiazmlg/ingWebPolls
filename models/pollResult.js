var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var pollResultSchema = mongoose.Schema({
    idEncuesta: Number,
    respuestas: [{
        texto: String,
        respuesta: String
    }]
}, { collection: 'pollresults' });

module.exports = mongoose.model('PollResult', pollResultSchema);