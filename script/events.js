"use strict";

/**
 * Initialisation des EventListeners
 */
divJeu.addEventListener("mouseover", function () {
    //changement de l'image du curseur en cas de mouseover sur la grille de jeu
    divJeu.style.cursor = "url(./images/target.cur), none";

});
divJeu.addEventListener("mouseout", function () {
    //en cas de mouseout de la grille de jeu, le curseur reprend son image par défaut
    divJeu.style.cursor = "auto";

});
btnF.addEventListener("click", function () {
    // créer la grille de 8*8 et cacher le menu
    size = 8;
    creerGrille(size);
    divJeu.hidden = false;
    menuDiv.style.visibility = "hidden";
    genererBateaux();
    nbBateauxRestants = 5;
    document.getElementById("nbRestant").textContent = nbBateauxRestants.toString();
});
btnM.addEventListener("click", function () {
    // créer la grille de 10*10 et cacher le menu
    size = 10;
    creerGrille(size);
    divJeu.hidden = false;
    menuDiv.style.visibility = "hidden";
    genererBateaux();
    nbBateauxRestants = 8;
    document.getElementById("nbRestant").textContent = nbBateauxRestants.toString();
});
btnD.addEventListener("click", function () {
    // créer la grille de 12*12 et cacher le menu
    size = 12;
    creerGrille(size);
    divJeu.hidden = false;
    menuDiv.style.visibility = "hidden";
    genererBateaux();
    nbBateauxRestants = 12;
    document.getElementById("nbRestant").textContent = nbBateauxRestants.toString();
});
btnR.addEventListener("click", function () {
    //reset de la grille et du score, reaffichage du menu
    divJeu.hidden = true;
    menuDiv.style.visibility = "";
    score = 0;
    nbBateauxCoules = 0;
    nbBateauxRestants = 0;
    majScore(score);
    document.getElementById("nbCoule").textContent = nbBateauxCoules.toString();
    document.getElementById("nbRestant").textContent = nbBateauxRestants.toString();
});
document.addEventListener("keydown", function (evt) {
    //Affichage/désaffichage de la fenêtre de pause du jeu lors de l'appui sur espace
    if (evt.which === 32) {
        pause();
    }
    else if (evt.which === 86) {
        victoire();
    }
});