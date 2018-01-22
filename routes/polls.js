var express = require('express');
var mongoose = require('mongoose');

// setup de mongoose 
mongoose.connect('mongodb://localhost/pollsapp');
var db = mongoose.connection;
// error en conexion 
db.on('error', console.error.bind(console, 'connection error:'));
// conexion abierta
db.once('open', function(){
    console.log('Conexion a mongo abierta');
});
var router = express.Router();

// creamos los modelos 
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
// crear un modelo a partir del esquema. 
var Poll = mongoose.model('Poll', pollSchema);

// sacar todos los documentos de polls
router.get('/', function(req,res,next) {
    Poll.find(function (err, polls) {
        if (err) return console.log(err);
        res.json(polls);
    })
});

router.get('/:id/pregunta/:idPregunta', function(req,res,next) {
    Poll.findOne({idEncuesta: req.params.id}, function(err,polls){
        if (err) return console.log(err);
        // comprobar que no se excede el maximo de preguntas. 
        if (req.params.idPregunta > polls.secciones[0].preguntas.length)
        {
            res.json({mensaje: "error, se execde el maximo de preguntas del cuestionario"});
        }
        res.json(
            polls.secciones[0].preguntas[req.params.idPregunta - 1]);
    })
});

router.get('/total/:id', function(req,res,next) {
    Poll.findOne({idEncuesta: req.params.id}, function(err,polls) {
        if (err) return console.log(err);
        res.json(polls.secciones[0].preguntas.length);
    })
});

// sacar documento por id 
router.get('/:id', function(req,res,next) {
    // pasamos el param id encuesta para filtrar y obtener el documento 
    Poll.findOne({idEncuesta: req.params.id}, function (err, polls) {
        if (err) return console.log(err);
        res.json(polls);
    })
});
module.exports = router;