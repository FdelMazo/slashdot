# SlashDot
...>.....>>.......>>>......>>>>.......>>>>>.............>>>>>>.......>>>>>>>.......

### ¿Como persiste la tabla?

* Al superar el record del Top 3 se pide un input del usuario (nombre) que se usa, de forma escondida, para llenar un Google Form (con el método POST).

* Todas las respuestas del Google Form llenan un Sheet de un Google Spreadsheet.

* Otra Sheet del mismo Spreadsheet agarra el Top 3 de la Sheet de todas las respuestas.

* Los datos del leaderboard se obtienen mostrando la spreadsheet como una JsonAPI. Esto se consigue cuando publicas el spreadhseet (File -> Publish to the Web) y despues usando d link: "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json"

* Después de 10 segundos de cambiado el record, se actualiza la tabla del sitio.
