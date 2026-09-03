let currentMode = '';
const maxScore = 8; 

// Variabili Giocatori e CPU
let numeroGiocatori = 1; 
let cpuDifficulty = 0; // 0 = Umano, 40/70/90 = CPU
let mosseSolitario = 0;
let giocatoreAttuale = 1;
let scoreG1 = 0;
let scoreG2 = 0;
let coppieTrovate = 0;

// Memoria della CPU
let memoriaCPU = {}; // Salverà { indice_posizione: {dati_carta} }
let isCpuTurn = false;

// Elementi HTML
const menuDiv = document.getElementById('menu');
const gameUiDiv = document.getElementById('game-ui');
const gameBoard = document.querySelector('.game');
const selettoreGiocatori = document.getElementById('scelta-giocatori');
const indicatoreTurno = document.getElementById('indicatore-turno');
const puntiG1Span = document.getElementById('punti-g1');
const puntiG2Span = document.getElementById('punti-g2');

// --------------------------------------------------------
// L'ARCHIVIO CARTE NAPOLETANE
// --------------------------------------------------------
const mazzi = {
    napoletane: {
        classic: [
            // Calderone grande con tutte le 16 carte per garantire varietà a ogni partita
            { id: "asso_c", testo: "<img src='img/asso_coppe.jpg' class='card-img'>" },
            { id: "asso_d", testo: "<img src='img/asso_denari.jpg' class='card-img'>" },
            { id: "asso_b", testo: "<img src='img/asso_bastoni.jpg' class='card-img'>" },
            { id: "asso_s", testo: "<img src='img/asso_spade.jpg' class='card-img'>" },
            
            { id: "re_c", testo: "<img src='img/re_coppe.jpg' class='card-img'>" },
            { id: "re_d", testo: "<img src='img/re_denari.jpg' class='card-img'>" },
            { id: "re_b", testo: "<img src='img/re_bastoni.jpg' class='card-img'>" },
            { id: "re_s", testo: "<img src='img/re_spade.jpg' class='card-img'>" },
            
            { id: "cavallo_c", testo: "<img src='img/cavallo_coppe.jpg' class='card-img'>" },
            { id: "cavallo_d", testo: "<img src='img/cavallo_denari.jpg' class='card-img'>" },
            { id: "cavallo_b", testo: "<img src='img/cavallo_bastoni.jpg' class='card-img'>" },
            { id: "cavallo_s", testo: "<img src='img/cavallo_spade.jpg' class='card-img'>" },
            
            { id: "donna_c", testo: "<img src='img/donna_coppe.jpg' class='card-img'>" },
            { id: "donna_d", testo: "<img src='img/donna_denari.jpg' class='card-img'>" },
            { id: "donna_b", testo: "<img src='img/donna_bastoni.jpg' class='card-img'>" },
            { id: "donna_s", testo: "<img src='img/donna_spade.jpg' class='card-img'>" }
        ],
        memorrachare: [
            // ASSI (Valore 1)
            { id: "1_c", valore: 1, affinita: "tondo", testo: "<img src='img/asso_coppe.jpg' class='card-img'>" },
            { id: "1_d", valore: 1, affinita: "tondo", testo: "<img src='img/asso_denari.jpg' class='card-img'>" },
            { id: "1_b", valore: 1, affinita: "lungo", testo: "<img src='img/asso_bastoni.jpg' class='card-img'>" },
            { id: "1_s", valore: 1, affinita: "lungo", testo: "<img src='img/asso_spade.jpg' class='card-img'>" },
            
            // RE (Valore 2)
            { id: "2_c", valore: 2, affinita: "tondo", testo: "<img src='img/re_coppe.jpg' class='card-img'>" },
            { id: "2_d", valore: 2, affinita: "tondo", testo: "<img src='img/re_denari.jpg' class='card-img'>" },
            { id: "2_b", valore: 2, affinita: "lungo", testo: "<img src='img/re_bastoni.jpg' class='card-img'>" },
            { id: "2_s", valore: 2, affinita: "lungo", testo: "<img src='img/re_spade.jpg' class='card-img'>" },
            
            // CAVALLI (Valore 3)
            { id: "3_c", valore: 3, affinita: "tondo", testo: "<img src='img/cavallo_coppe.jpg' class='card-img'>" },
            { id: "3_d", valore: 3, affinita: "tondo", testo: "<img src='img/cavallo_denari.jpg' class='card-img'>" },
            { id: "3_b", valore: 3, affinita: "lungo", testo: "<img src='img/cavallo_bastoni.jpg' class='card-img'>" },
            { id: "3_s", valore: 3, affinita: "lungo", testo: "<img src='img/cavallo_spade.jpg' class='card-img'>" },
            
            // DONNE (Valore 4)
            { id: "4_c", valore: 4, affinita: "tondo", testo: "<img src='img/donna_coppe.jpg' class='card-img'>" },
            { id: "4_d", valore: 4, affinita: "tondo", testo: "<img src='img/donna_denari.jpg' class='card-img'>" },
            { id: "4_b", valore: 4, affinita: "lungo", testo: "<img src='img/donna_bastoni.jpg' class='card-img'>" },
            { id: "4_s", valore: 4, affinita: "lungo", testo: "<img src='img/donna_spade.jpg' class='card-img'>" }
        ]
    }
};
// --------------------------------------------------------
// IL MOTORE DEL GIOCO E LA LOGICA
// --------------------------------------------------------

const btnClassic = document.getElementById('btn-classic');
const btnMemorrachare = document.getElementById('btn-memorrachare');

btnClassic.addEventListener('click', () => {
    riproduciSuono(suoni.click);
    startGame('classic')});

btnMemorrachare.addEventListener('click', () => {
    riproduciSuono(suoni.click);
    startGame('memorrachare')});

function aggiornaInterfacciaTurni() {
    if (numeroGiocatori === 1) {
        indicatoreTurno.innerHTML = "Solo Mode";
        puntiG1Span.innerHTML = mosseSolitario + " moves"; 
    } else {
        let nomeG2 = (cpuDifficulty > 0) ? "CPU" : "PLAYER 2";
        if (giocatoreAttuale === 1) indicatoreTurno.innerHTML = "Turn: PLAYER 1";
        else indicatoreTurno.innerHTML = "Turn: " + nomeG2;
        
        puntiG1Span.innerHTML = scoreG1;
        puntiG2Span.innerHTML = scoreG2;
    }
}

// Funzione per visualizzare la carta appena presa nel pannello laterale
function mostraCartaPresa(giocatore, imgScelta) {
    // Determina in quale contenitore inserire la carta (1 per P1, 2 per P2)
    const contenitoreID = giocatore === 1 ? 'carte-prese-p1' : 'carte-prese-p2';
    const contenitore = document.getElementById(contenitoreID);
    
    // Crea il tag <img> e gli assegna la fonte dell'immagine
    const imgElement = document.createElement('img');
    imgElement.src = imgScelta; // Usa il percorso della carta appena accoppiata
    imgElement.classList.add('mini-carta-presa');
    
    // Aggiunge la carta al pannello
    contenitore.appendChild(imgElement);
}

// Funzione per mostrare il "+1" fluttuante vicino al punteggio
function mostraAnimazionePiuUno(idElementoTarget) {
    const target = document.getElementById(idElementoTarget);
    if (!target) return;
    
    // Diciamo al contenitore padre di fare da "ancora" per il testo fluttuante
    target.parentNode.style.position = 'relative';
    
    // Creiamo il testo +1
    const piuUno = document.createElement('span');
    piuUno.textContent = '+1';
    piuUno.classList.add('piu-uno');
    
    // Lo "attacchiamo" al punteggio
    target.parentNode.appendChild(piuUno);
    
    // Autodistruzione dopo 1 secondo (la durata esatta dell'animazione CSS)
    setTimeout(() => {
        piuUno.remove();
    }, 1000);
}

function startGame(mode) {
    currentMode = mode;
    
    // Configura la partita in base al menu
    let scelta = parseInt(selettoreGiocatori.value);
    if (scelta === 1 || scelta === 2) {
        numeroGiocatori = scelta;
        cpuDifficulty = 0;
    } else {
        numeroGiocatori = 2; // È comunque un 1 vs 1
        cpuDifficulty = scelta; // Salva la probabilità (40, 70 o 90)
    }

    // Mostra la schermata di gioco
    menuDiv.classList.add('hidden');
    gameUiDiv.classList.remove('hidden');

    // =========================================
    // GESTIONE LAYOUT (Solo vs Multiplayer)
    // =========================================
    const panelP1 = document.getElementById('panel-p1');
    const panelP2 = document.getElementById('panel-p2');
    const punteggioSolo = document.getElementById('punteggio-solo');

    if (numeroGiocatori === 1) {
        // Nasconde i pannelli laterali e mostra il punteggio centrale
        panelP1.classList.add('hidden');
        panelP2.classList.add('hidden');
        punteggioSolo.classList.remove('hidden');
    } else {
        // Mostra i pannelli laterali e nasconde il punteggio centrale
        panelP1.classList.remove('hidden');
        panelP2.classList.remove('hidden');
        punteggioSolo.classList.add('hidden');
        
        // Pulisce le carte collezionate da partite precedenti
        document.getElementById('carte-prese-p1').innerHTML = '';
        document.getElementById('carte-prese-p2').innerHTML = '';
    }
    
    gameBoard.innerHTML = '';
    giocatoreAttuale = 1;
    scoreG1 = 0;
    scoreG2 = 0;
    mosseSolitario = 0;
    coppieTrovate = 0;
    memoriaCPU = {}; // Azzera la memoria
    isCpuTurn = false; 
    aggiornaInterfacciaTurni();

    
    let mazzoAttuale = [];
    
    if (currentMode === 'classic') {
        let interoMazzo = [...mazzi.napoletane.classic]; 
        interoMazzo.sort(() => (Math.random() > .5) ? 2 : -1); 
        let carteScelte = interoMazzo.slice(0, 8); 
        mazzoAttuale = [...carteScelte, ...carteScelte]; 
    } else if (currentMode === 'memorrachare') {
        mazzoAttuale = mazzi.napoletane.memorrachare; 
    }

    mazzoAttuale.sort(() => (Math.random() > .5) ? 2 : -1);

    for (let i = 0; i < mazzoAttuale.length; i++) {
        let box = document.createElement('div');
        box.className = 'item';
        box.dataset.indice = i; // Salva la posizione nella griglia
        
        box.innerHTML = `<span style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">${mazzoAttuale[i].testo}</span>`;
        
        box.dataset.id = mazzoAttuale[i].id;
        if(currentMode === 'memorrachare') {
            box.dataset.valore = mazzoAttuale[i].valore;
            box.dataset.affinita = mazzoAttuale[i].affinita;
        }
        
        gameBoard.appendChild(box);
        
        box.onclick = function() {
            // Se è il turno della CPU, blocca i click umani
            if (isCpuTurn && !this.classList.contains('simulato')) return;
            this.classList.remove('simulato');

            if(this.classList.contains('boxOpen') || this.classList.contains('boxMatch')) return;

            riproduciSuono(suoni.flip);

            this.classList.add('boxOpen');
            
            // AGGIORNA LA MEMORIA DELLA CPU
            memoriaCPU[this.dataset.indice] = {
                id: this.dataset.id,
                valore: this.dataset.valore,
                affinita: this.dataset.affinita
            };
            
            let openBoxes = document.querySelectorAll('.item.boxOpen:not(.boxMatch)');
            
            if(openBoxes.length === 2) {
                gameBoard.style.pointerEvents = 'none';

                setTimeout(function() {
                    let match = false;
                    
                    if (currentMode === 'classic') {
                        if(openBoxes[0].dataset.id === openBoxes[1].dataset.id) match = true;
                    } else if (currentMode === 'memorrachare') {
                        if(openBoxes[0].dataset.valore === openBoxes[1].dataset.valore && 
                           openBoxes[0].dataset.affinita === openBoxes[1].dataset.affinita) match = true;
                    }

                    // Aumenta le mosse e aggiorna subito lo schermo nel Solo Mode!
                    if (numeroGiocatori === 1) {
                        mosseSolitario++;
                        document.getElementById('punti-g1-solo').textContent = mosseSolitario;
                    }

                    // ESITO
                    if(match) {

                        riproduciSuono(suoni.match);

                        openBoxes[0].classList.add('boxMatch');
                        openBoxes[1].classList.add('boxMatch');
                        openBoxes[0].classList.remove('boxOpen');
                        openBoxes[1].classList.remove('boxOpen');
                        
                        coppieTrovate++;
                        
                        // RECUPERHIAMO IL PERCORSO DELL'IMMAGINE DELLA CARTA APPENA PRESA
                        let imgTrovata = openBoxes[0].querySelector('img') ? openBoxes[0].querySelector('img').src : '';

                        if (numeroGiocatori === 2) {
                            if (coppieTrovate < maxScore) {
                                if(giocatoreAttuale === 1) {
                                    scoreG1++;
                                    document.getElementById('punti-g1').textContent = scoreG1;
                                    mostraCartaPresa(1, imgTrovata); 
                                    // LA MAGIA: Chiama il +1 per il Giocatore 1!
                                    mostraAnimazionePiuUno('punti-g1'); 
                                } else {
                                    scoreG2++;
                                    document.getElementById('punti-g2').textContent = scoreG2;
                                    mostraCartaPresa(2, imgTrovata); 
                                    // LA MAGIA: Chiama il +1 per il Giocatore 2!
                                    mostraAnimazionePiuUno('punti-g2'); 
                                }
                            }
                        } else {
                            scoreG1++; 
                            mostraCartaPresa(1, imgTrovata); 
                            
                            // LA MAGIA (Solo Mode): Mostra un incoraggiante +1 vicino al contatore mosse!
                            mostraAnimazionePiuUno('punti-g1-solo'); 
                        }
                        
                        aggiornaInterfacciaTurni();

                        let partitaFinita = false;
                        if (numeroGiocatori === 1 && coppieTrovate === maxScore) {
                            partitaFinita = true;
                        } 
                        else if (numeroGiocatori === 2 && coppieTrovate === (maxScore - 1)) {
                            partitaFinita = true;
                            let ultimeCarte = document.querySelectorAll('.item:not(.boxMatch)');
                            ultimeCarte.forEach(carta => {
                                carta.classList.add('boxMatch'); 
                            });
                        }

                        if (partitaFinita) {
                            let titolo = "";
                            let messaggio = "";
                            let esito = "vittoria"; 

                            if (numeroGiocatori === 1) {
                                titolo = "YOU WON!";
                                messaggio = "Completed in " + mosseSolitario + " moves!";
                            } else {
                                let nomeG2 = (cpuDifficulty > 0) ? "The CPU" : "PLAYER 2";
                                if (scoreG1 > scoreG2) {
                                    titolo = "PLAYER 1 WINS!";
                                    messaggio = "Score: " + scoreG1 + " to " + scoreG2;
                                } else if (scoreG2 > scoreG1) {
                                    titolo = nomeG2 + " WINS!";
                                    messaggio = "Score: " + scoreG2 + " to " + scoreG1;
                                    // Se vince la CPU, lo calcoliamo come una sconfitta per il giocatore
                                    if (cpuDifficulty > 0) esito = "sconfitta"; 
                                } else {
                                    titolo = "IT'S A DRAW!";
                                    messaggio = "Score: " + scoreG1 + " to " + scoreG2;
                                    esito = "pareggio";
                                }
                            }
                            
                            // Richiama la modale invece dell'alert
                            setTimeout(() => mostraModale(titolo, messaggio, esito), 600);
                        } else {
                            // IL PEZZO CHE MANCAVA: Se la partita NON è finita e tocca alla CPU, deve continuare a giocare!
                            if (giocatoreAttuale === 2 && cpuDifficulty > 0) {
                                setTimeout(mossaCPU, 1000);
                            }
                        }
                    } else { // LA PARENTESI CHE MANCAVA: Separa il punto fatto dall'errore
                        // ERRORE

                        riproduciSuono(suoni.errore);

                        openBoxes[0].classList.remove('boxOpen');
                        openBoxes[1].classList.remove('boxOpen');
                        
                        if (numeroGiocatori === 2) {
                            giocatoreAttuale = (giocatoreAttuale === 1) ? 2 : 1;
                        }
                        aggiornaInterfacciaTurni();
                        
                        // Passa il turno alla CPU se necessario
                        if (giocatoreAttuale === 2 && cpuDifficulty > 0) {
                            isCpuTurn = true;
                            setTimeout(mossaCPU, 800);
                        } else {
                            isCpuTurn = false;
                        }
                    }

                    gameBoard.style.pointerEvents = 'auto';
                }, 800); 
            } else if (openBoxes.length === 1 && isCpuTurn) {
                // La CPU ha girato la prima carta, ora pensa alla seconda
                setTimeout(mossaCPU, 1000);
            }
        }
    }
}

// --------------------------------------------------------
// INTELLIGENZA ARTIFICIALE (FUZZY LOGIC)
// --------------------------------------------------------
function mossaCPU() {
    if (coppieTrovate >= (maxScore - 1)) return; // Partita finita

    let carteSulTavolo = Array.from(document.querySelectorAll('.item'));
    let carteCoperte = document.querySelectorAll('.item:not(.boxOpen):not(.boxMatch)');
    let carteAperte = document.querySelectorAll('.item.boxOpen:not(.boxMatch)');

    // PRIMA SCELTA: Va a caso
    if (carteAperte.length === 0) {
        let randomIdx = Math.floor(Math.random() * carteCoperte.length);
        carteCoperte[randomIdx].classList.add('simulato');
        carteCoperte[randomIdx].click();
    } 
    // SECONDA SCELTA: Ragionamento e Probabilità
    else if (carteAperte.length === 1) {
        let primaCarta = carteAperte[0];
        let targetIndex = -1;

        // Cerca nella memoria la compagna
        for (let indice in memoriaCPU) {
            // Ignora se stessa e le carte già accoppiate
            if (indice === primaCarta.dataset.indice || carteSulTavolo[indice].classList.contains('boxMatch')) continue;

            if (currentMode === 'classic' && memoriaCPU[indice].id === primaCarta.dataset.id) {
                targetIndex = parseInt(indice); break;
            } else if (currentMode === 'memorrachare' && 
                       memoriaCPU[indice].valore === primaCarta.dataset.valore && 
                       memoriaCPU[indice].affinita === primaCarta.dataset.affinita) {
                targetIndex = parseInt(indice); break;
            }
        }

        if (targetIndex !== -1) {
            // La sa! Tira il dado
            let dado = Math.random() * 100;
            if (dado <= cpuDifficulty) {
                // Precisione: Clicca quella giusta
                carteSulTavolo[targetIndex].classList.add('simulato');
                carteSulTavolo[targetIndex].click();
            } else {
                // Confusione: Cerca nel vicinato
                let vicini = [];
                // Calcolo matematica griglia 4x4
                if (targetIndex >= 4) vicini.push(targetIndex - 4); // Sopra
                if (targetIndex < 12) vicini.push(targetIndex + 4); // Sotto
                if (targetIndex % 4 !== 0) vicini.push(targetIndex - 1); // Sinistra
                if ((targetIndex + 1) % 4 !== 0) vicini.push(targetIndex + 1); // Destra

                // Filtra i vicini che si possono effettivamente cliccare
                let viciniValidi = vicini.filter(idx => 
                    !carteSulTavolo[idx].classList.contains('boxMatch') && 
                    !carteSulTavolo[idx].classList.contains('boxOpen')
                );

                if (viciniValidi.length > 0) {
                    let randomVicino = viciniValidi[Math.floor(Math.random() * viciniValidi.length)];
                    carteSulTavolo[randomVicino].classList.add('simulato');
                    carteSulTavolo[randomVicino].click();
                } else {
                    // Vicinato tutto scoperto, ripiega sul caso attivando l'anti-fortuna
                    cliccaCartaACaso(carteCoperte, primaCarta);
                }
            }
        } else {
            // Non l'ha mai vista in memoria, va a caso attivando l'anti-fortuna
            cliccaCartaACaso(carteCoperte, primaCarta);
        }
    }
}

function cliccaCartaACaso(carteCoperte, primaCarta = null) {
    // La CPU pesca puramente a caso tra le carte rimaste coperte.
    // Nessun trucco e nessun blocco: se azzecca, è pura e semplice fortuna umana!
    let randomIdx = Math.floor(Math.random() * carteCoperte.length);
    carteCoperte[randomIdx].classList.add('simulato');
    carteCoperte[randomIdx].click();
}

// --------------------------------------------------------
// GESTIONE DELLA SCHERMATA DI FINE PARTITA
// --------------------------------------------------------
function mostraModale(titolo, messaggio, esito) {
    const modal = document.getElementById('modal-risultato');
    const modalTitolo = document.getElementById('modal-titolo');
    const modalMessaggio = document.getElementById('modal-messaggio');
    const modalImg = document.getElementById('modal-img');
    const gameUi = document.getElementById('game-ui');

    // Nasconde il tabellone di gioco
    gameUi.classList.add('hidden');

    // Mostra il punteggio/mosse
    modalMessaggio.innerHTML = messaggio;
    
    // NASCONDE DEFINITIVAMENTE IL TITOLO HTML (ci pensano le immagini!)
    modalTitolo.innerHTML = "";
    modalTitolo.style.display = 'none';
    
    if (esito === 'vittoria') {
        modalImg.src = 'img/mascotte-win.png'; 
        riproduciSuono(suoni.vittoria); // 🎉 SUONO VITTORIA
    } else {
        // Usiamo il re triste sia per la sconfitta che per il pareggio
        modalImg.src = 'img/mascotte-lose.png'; 
        riproduciSuono(suoni.sconfitta); // 🎺 SUONO SCONFITTA
    }

    modal.classList.remove('hidden');
}

// ==========================================
// GESTIONE RITORNO AL MENU (Senza ricaricare la pagina!)
// ==========================================

// Selezioniamo i bottoni e i contenitori
const btnResetGioco = document.getElementById('reset');       // Tasto sotto al tavolo
const btnResetModale = document.getElementById('modal-btn');  // Tasto a fine partita
const gameUI = document.getElementById('game-ui');
const menuPanel = document.getElementById('menu');
const modalRisultato = document.getElementById('modal-risultato');

// Funzione unica per tornare alla Home
function tornaAlMenu() {
    // 1. Riproduci il suono del click!
    riproduciSuono(suoni.click); 

    
    // 2. Nascondiamo il tavolo da gioco e la modale
    gameUI.classList.add('hidden');
    modalRisultato.classList.add('hidden');
    
    // 3. Facciamo riapparire il pannello del menù principale
    menuPanel.classList.remove('hidden');
}

// Agganciamo la funzione a ENTRAMBI i bottoni "BACK TO MENU"
if (btnResetGioco) {
    btnResetGioco.addEventListener('click', tornaAlMenu);
}

if (btnResetModale) {
    btnResetModale.addEventListener('click', tornaAlMenu);
}

// ==========================================
// GESTIONE AUDIO E VOLUMI - MEMORRACHARÉ
// ==========================================
const suoni = {
    flip: new Audio('audio/flip.mp3'),
    match: new Audio('audio/point.mp3'),
    errore: new Audio('audio/hic.mp3'),
    vittoria: new Audio('audio/win.mp3'),
    sconfitta: new Audio('audio/lose.mp3'),
    sottofondo: new Audio('audio/abydos_music-chill-reggae.mp3'),
    click: new Audio('audio/click.mp3')
};

// Impostazioni iniziali
suoni.sottofondo.loop = true;
suoni.sottofondo.volume = 0.7; // Volume musica iniziale
let volumeEffetti = 0.7;       // Volume effetti iniziale 

// Selezioniamo gli elementi dell'HTML
const btnImpostazioni = document.getElementById('btn-impostazioni');
const pannelloAudio = document.getElementById('pannello-audio');
const btnChiudiAudio = document.getElementById('chiudi-audio');

const sliderMusica = document.getElementById('vol-musica');
const sliderEffetti = document.getElementById('vol-effetti');
const toggleMusica = document.getElementById('toggle-musica');
const toggleEffetti = document.getElementById('toggle-effetti');

// Memoria per il "Muto rapido" (ricorda il volume prima di mutare)
let ultimoVolumeMusica = 0.7;
let ultimoVolumeEffetti = 0.7;

// --- FUNZIONI DI SUPPORTO PER CAMBIARE LE ICONE ---
function aggiornaIconaMusica(vol) {
    toggleMusica.innerHTML = vol > 0 ? '🎵 Music' : '🔇 Music';
}

function aggiornaIconaEffetti(vol) {
    toggleEffetti.innerHTML = vol > 0 ? '🔊 Sound Effects' : '🔈 Sound Effects';
}

// --- APERTURA / CHIUSURA PANNELLO ---
btnImpostazioni.addEventListener('click', () => {
    pannelloAudio.classList.toggle('hidden');
    if (suoni.sottofondo.paused && sliderMusica.value > 0) {
        suoni.sottofondo.play().catch(e => console.log("Attesa..."));
    }
});

btnChiudiAudio.addEventListener('click', () => {
    pannelloAudio.classList.add('hidden');
});

// ==========================================
// LOGICA MUSICA (Slider + Bottone)
// ==========================================
sliderMusica.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    suoni.sottofondo.volume = vol;
    
    if (vol > 0) ultimoVolumeMusica = vol; // Salva il volume se non è zero
    aggiornaIconaMusica(vol);
    
    if (vol > 0 && suoni.sottofondo.paused) suoni.sottofondo.play();
    else if (vol === 0 && !suoni.sottofondo.paused) suoni.sottofondo.pause();
});

toggleMusica.addEventListener('click', () => {
    if (suoni.sottofondo.volume > 0) {
        // Mette in Muto
        suoni.sottofondo.volume = 0;
        sliderMusica.value = 0;
        suoni.sottofondo.pause();
    } else {
        // Toglie il Muto (Ripristina o usa 0.7 di default)
        const nuovoVol = ultimoVolumeMusica > 0 ? ultimoVolumeMusica : 0.7;
        suoni.sottofondo.volume = nuovoVol;
        sliderMusica.value = nuovoVol;
        suoni.sottofondo.play().catch(e => {});
    }
    aggiornaIconaMusica(suoni.sottofondo.volume);
});

// ==========================================
// LOGICA EFFETTI (Slider + Bottone)
// ==========================================
sliderEffetti.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    volumeEffetti = vol;
    
    if (vol > 0) ultimoVolumeEffetti = vol; // Salva il volume se non è zero
    aggiornaIconaEffetti(vol);
});

toggleEffetti.addEventListener('click', () => {
    if (volumeEffetti > 0) {
        // Mette in Muto
        volumeEffetti = 0;
        sliderEffetti.value = 0;
    } else {
        // Toglie il Muto (Ripristina o usa 0.7 di default)
        const nuovoVol = ultimoVolumeEffetti > 0 ? ultimoVolumeEffetti : 0.7;
        volumeEffetti = nuovoVol;
        sliderEffetti.value = nuovoVol;
    }
    aggiornaIconaEffetti(volumeEffetti);
});

// La funzione dei suoni ora applica dinamicamente il volume scelto!
function riproduciSuono(suono) {
    if (volumeEffetti === 0) return; // Se lo slider è a 0, non suona niente
    
    suono.volume = volumeEffetti; // Assegna il volume scelto dalla levetta
    suono.currentTime = 0; 
    suono.play().catch(e => {
        console.log("In attesa del primo click del giocatore...");
    });
}