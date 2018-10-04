"use strict";

let size = 0;
let btnF = document.getElementById("facile");
let btnM = document.getElementById("moyen");
let btnD = document.getElementById("difficile");
let btnR = document.getElementById("reset");
let menuDiv = document.getElementById("menu");
let divJeu = document.getElementById("battleship");
let divVictoire = document.getElementById("victoire");
let divPause = document.getElementById("pause");
let sizeTd = 40;
let sizeimg = sizeTd - 5;
let score = 0;
let nbBateauxCoules = 0;
let nbBateauxRestants = 0;
let pauseJeu = false;
let positionsDestroyer = [];
let positionsPA = [];
let positionsSM = [];
let positionsNavPat = [];
let tabBateaux = [];
/**
 * Affichages des informations initiales
 * @type {string}
 */
document.getElementById("score").textContent = score.toString();
document.getElementById("nbCoule").textContent = nbBateauxCoules.toString();
document.getElementById("nbRestant").textContent = nbBateauxRestants.toString();