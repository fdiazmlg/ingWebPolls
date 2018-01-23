var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var pollSchema = mongoose.Schema({
    idEncuesta: Number,
    secciones: [{
        id: Number,
        preguntas: [
        {
            tipo: String,
            texto: String,
            percent_diagnostico: Number,
            opciones: Array
        }]
    }
    ]
});

module.exports = mongoose.model('Poll', pollSchema);