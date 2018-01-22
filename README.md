
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
{"opciones":["Caucasiano","Arabe","Africano","Asiático","Negro americano"],"tipo":"seleccion","percent_diagnostico":0,"texto":"Raza"}
```

```json
{"opciones":[],"tipo":"texto","texto":"Edad","percent_diagnostico":0}```` 


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
            ]
        }
        ]
    }
    ]
}
```