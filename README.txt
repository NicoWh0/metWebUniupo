PREMESSA IMPORTANTE:
Per via del limite dei 20 MB della consegna, si prega di scaricare i file relativi alle immagini caricate dagli utenti al link google drive:
https://drive.google.com/drive/folders/1hwdxMnYAHB61IjHrqGyhidJobmYFRK2D?usp=sharing

Copiare la cartella presente nel link (eventualmente dopo averla decompressa) dentro quella del progetto (nel path root, dove si trova server, DAOs e cartella public).
Questo permette di poter visualizzare le immagini già caricate all'interno dell'applicazione.
Senza questa operazione, l'applicazione non può visualizzare le immagini caricate dagli utenti.



Per installare e avviare l'applicazione, digitare i seguenti comandi su terminale:

npm install --save (per installare le dipendenze)
npm start (per avviare)

oppure

npm run dev (per avviare in modalità sviluppatore)

Nota: questi comandi richiedono node.js e npm installati sul proprio pc:
https://nodejs.org/en/download/
L'installazione di node.js e npm richiede anche l'installazione di python sul proprio pc:
https://www.python.org/downloads/


Leggere il file dati_utenti.txt per vedere nomi utente, password e tipo utente disponibili fin dall'inizio (di default, la password per tutti gli utenti iniziale è Password1!)

Il server è raggiungibile all'indirizzo http://localhost:3000/


Link al video di presentazione:
https://youtu.be/skINhWiRdSU



L'installazione è stata testata su sistema operativo Windows 11, Linux Ubuntu 24.04 e Linux Mint 21.3.
Nota per gli utenti Linux:
Se si utilizza il software ark per decomprimere la cartella .zip del progetto, è possibile che tutti i file
vengano decompressi nella cartella root del progetto, rompendo la struttura delle cartelle.
Si suggerisce quindi di utilizzare un altro software di decompressione, come ad esempio unzip o arquiver.