# Kasse-i-en-KASS-javascript
Dette repo indeholder et program til visualisering af data fra arrangementet "En Kasse i en KA$$", som typisk foregår én gang om året på [TÅGEKAMMERET](tket.dk) ved Aarhus Universitet. Programmet er lavet til at være 100% klient-baseret, og kræver ingen serveropsætning.

## Hvordan tilføjer jeg K\*KA$$ til oversigten?
Programmet henter data fra [https://enkasseienfestforening.dk/timetrial/json/](https://enkasseienfestforening.dk/timetrial/json/).
For at tilføje et nyt datasæt, skal personen, som du vil tilføje til oversigten, være gået i gang med at tage tid.
Tilgå linket ovenover, og finder det datasæt som du vil tilføje. Find dets ID, og tilføj denne værdi til select-elementet i index.html-filen.

## Baggrund
Jeg sad på kammeret under "En Kasse i en KA$$" i 2019, og nogen holdt statistisk på tavlen.
Jeg tænkte det ville være grineren at prøve at forudsige hvornår KA$$ blev færdig ved hjælp fit til forskellige funktioner.
FORM 13/14 viste mig, hvordan jeg kunne hente dataen fra databasen, da denne alligevel blev brugt til at tælle øl.
Det originale program blev skrevet i python og plottet med matplotlib.
I 2019 lagde jeg manuelt figuropdateringer op på den tilsvarende facebook-begivenhed, da dette blev efterspurgt.
I 2020 (da jeg selv var i BEST) blev arrangementet livestreamet, og figurer fra programmet blev brugt som grafisk overlay.
I 2021 benyttede jeg samme overlay, og streamede de genererede figurer, selvom arrangementet ikke blev livestreamet.
I 2023 var dette projekt klar, og blev hostet på [kik.candscient.dk](kik.candscient.dk).

## Må jeg stjæle dette?
Læs licensen.