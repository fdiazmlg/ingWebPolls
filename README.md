
### ReactJS + Express polls application

Proyecto de ingenieria web para una web de encuestas.

La aplicación está compuesta por un backend en Express y la UI renderizada por ReactJS a través de un proxy. 

[Cliente] ReactJS <> Express [Servidor]

Para ejecutar el proyecto:
`npm install`
`npm start`

Para ver las encuestas podemos entrar en localhost:3000/polls

Peticiones de encuestas:

`/polls/total/:id // obtener el total de preguntas de una encuesta`

`'/:id/pregunta/:idPregunta' // obtener la pregunta :idPregunta de la encuesta :id ` Devuelve error en caso de no existir la pregunta. 

Ejemplo:

```json
{"valor_opciones": [0.1, 0.1, 0.1, 0.5, 0.1], "opciones":["Caucasiano","Arabe","Africano","Asiático","Negro americano"],"tipo":"seleccion","percent_diagnostico":0,"texto":"Raza"}
```

```json
{"valor_opciones": [], "opciones":[],"tipo":"texto","texto":"Edad","percent_diagnostico":0}```` 

Via POST

`polls/anadir/:id // añadir preguntas al cuestionario :id `

Parametros para preguntas de texto:

```json
{
  "texto": "Texto de la pregunta",
  "tipo": "texto",
}
```
Para las preguntas de seleccion múltiple


```json
{
  "texto": "Texto de la pregunta",
  "tipo": "texto",
  "opciones": [
    "opcion1", "opcion2", "..."
  ],
  "valor_opciones": [
    0.x, 0.y, ...
  ]
}
```

Obtener los resultados de todas las encuestas:

`polls/encuestas`

Nos devolverá

```json
[{"respuestas":[{"texto":"¿Que edad tienes?","respuesta":"30"},{"texto":"¿Raza?","respuesta":"Caucasico"}],"_id":"5a664bcee407337d9b29158b","idEncuesta":1}]
```

Obtener todas las encuestas del grupo o id 1. 

`polls/encuestas/:id`

`polls/encuestas/anadir`

Añadir los resultados de los cuestionarios a la coleccion correspondiente.

Formato:

```json
{
  "respuestas": [
    {
      "texto": "",
      "respuesta": "",
    }
  ],
  "idEncuesta": 1
}
```

```json
[{"respuestas":[{"texto":"¿Que edad tienes?","respuesta":"30"},{"texto":"¿Raza?","respuesta":"Caucasico"}],"_id":"5a664bcee407337d9b29158b","idEncuesta":1}]
```




Las encuestas se guardan en un formato JSON en una base de datos MongoDB. 

```json
{
  "idEncuesta": 1,
  "secciones": [
    {
      "id": 1,
      "preguntas": [
        {
          "tipo": "texto",
          "texto": "Edad",
          "percent_diagnostico": 0
        },
        {
          "tipo": "seleccion",
          "percent_diagnostico": 0, 
          "texto": "Raza",
          "opciones": [
            "Caucasiano", "Arabe", "Africano", "Asiático", "Negro americano"
            ],
          "valor_opciones": [0.1, 0.1, 0.1, 0.5, 0.1]
        }
        ]
    }
    ]
}
```


Poblar database

```
mongo
use celiacpoll
db.polls.insert({   "idEncuesta": 1,   "secciones": [     {       "id": 1,       "preguntas": [         {           "tipo": "texto",           "texto": "Edad",           "percent_diagnostico": 0         },         {           "tipo": "seleccion",           "percent_diagnostico": 0,            "texto": "Raza",           "opciones": [             "Caucasiano", "Arabe", "Africano", "Asiático", "Negro americano"             ]         }         ]     }     ] })
db.pollresults.insert({"respuestas":[{"texto":"¿Que edad tienes?","respuesta":"30"},{"texto":"¿Raza?","respuesta":"Caucasico"}],"_id":"5a664bcee407337d9b29158b","idEncuesta":1})
```
Luego probar
localhost:3000/polls
localhost:3000/polls/resultados