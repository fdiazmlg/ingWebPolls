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

// crear schema de pollresult 
var pollResultSchema = mongoose.Schema({
    idEncuesta: Number,
    respuestas: [{
        texto: String,
        respuesta: String
    }]
});

// crear modelo de resultados a partir del esquema 
var PollResult = mongoose.model('PollResult', pollResultSchema);
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

// obtener todos los resultados de las encuestas
router.get('/resultados', function(req,res,next) {
    PollResult.find(function(err, pollresults) {
        if (err) return console.log(err);
        res.json(pollresults)
    })
});
// obtener resultados por tipo de encuesta (e.g: grupo de encuesta con id 1)
router.get('/resultados/:id', function(req,res,next){
    PollResult.find({idEncuesta: req.params.id}, function(err, pollresults) {
        if (err) return console.log(err);
        res.json(pollresults);
    })
});



// sacar todos los documentos de polls
router.get('/', function(req,res,next) {
    Poll.find(function (err, polls) {
        if (err) return console.log(err);
        res.json(polls);
    })
});

// almacenar los resultados de las encuestas
router.post('/encuestas/anadir', function(req,res,next) {
    var resultado = new PollResult({
        idEncuesta: req.body.idEncuesta,
        respuestas: req.body.respuestas
    });
    resultado.save();
    res.json(
        {
            mensaje: "Insertado con exito el resultado de la encuesta"
        }
    );
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


// añadir preguntas para poder modificar las encuestas.
router.post('/anadir/:id', function(req,res,next){
    Poll.findOne({idEncuesta: req.params.id}, function(err,polls) {
        if (err) return console.log(err);
        // comrpboar que sea valido
        if(typeof req.body.texto == "undefined" || typeof req.body.tipo == "undefined")
        {
            res.json({mensaje: "error - no se han especificado los campos tipo o texto"});
        }
        else {
            // comprobar si es campo de texto
            if (req.body.texto == "texto") {
                polls.secciones[0].preguntas.push({texto: req.body.texto, tipo: req.body.tipo});
                polls.save();
                res.json({mensaje: "pregunta insertada con exito"});
            }
            else
            {
                polls.secciones[0].preguntas.push({texto: req.body.texto, tipo: req.body.tipo, opciones: req.body.opciones});
                polls.save();
                res.json({mensaje: "pregunta insertada con exito"});
            }
        }
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