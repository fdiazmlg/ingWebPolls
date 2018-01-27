var express = require('express');

// Import models
var Poll  = require('../models/poll.js');
var PollResult  = require('../models/pollResult.js');

//// --- Routing
var router = express.Router();

// -- Poll Controllers -- Collection: polls
// Get all Polls
router.get('/', function(req,res,next) {
    Poll.find(function (err, polls) {
        if (err) return console.log(err);
        res.json(polls);
    })
});

// Get Poll with ?idPoll
router.get('/:id', function(req,res,next) {
    // pasamos el param id encuesta para filtrar y obtener el documento 
    Poll.findOne({idEncuesta: req.params.id}, function (err, polls) {
        if (err) return console.log(err);
        res.json(polls);
    })
});

// Get Questions Number from Poll with ?idPoll
router.get('/total/:id', function(req,res,next) {
    Poll.findOne({idEncuesta: req.params.id}, function(err,polls) {
        if (err) return console.log(err);
        res.json(polls.secciones[0].preguntas.length);
    })
});

// Get Question ?idPreg from Poll with ?idPoll
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

// Add Question to Poll with ?idPoll
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

// Modify Question ?idPreg from Poll with ?idPoll
/*
TODO
*/

// PollResult Controller -- Collection: pollresults
// Get all PollResults
router.get('/resultados', function(req,res,next) {
    PollResult.find(function(err, pollresults) {
        if (err) return console.log(err);
        res.json(pollresults)
    })
});
// Get all PollResults for Poll with ?idPoll
router.get('/resultados/:id', function(req,res,next){
    PollResult.find({idEncuesta: req.params.id}, function(err, pollresults) {
        if (err) return console.log(err);
        res.json(pollresults);
    })
});

// Save a PollResult
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

// Other Controller-- IDK

module.exports = router;