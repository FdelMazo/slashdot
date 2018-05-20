# SlashDot
...>.....>>.......>>>......>>>>.......>>>>>.............>>>>>>.......>>>>>>>.......

### ¿Como persiste la tabla?

* Al superar el record del Top 3 se pide un input del usuario (nombre) que se usa, de forma escondida, para llenar un Google Form (con el método POST).

* Todas las respuestas del Google Form llenan un Sheet de un Google Spreadsheet.

* Otra Sheet del mismo Spreadsheet agarra el Top 3 de la Sheet de todas las respuestas.

* Haciendo uso de la versión gratuita de [sheetsu](http://sheetsu.com/) se puede leer la Sheet del top como si fuese una RESTful API (200 lecturas por mes).

* Después de 10 segundos, se actualiza la tabla del sitio.
