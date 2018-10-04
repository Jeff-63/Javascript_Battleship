"use strict";

/**
 * Fonction de création de la grille
 * @param size
 */
function creerGrille(size) {

    divJeu.innerHTML = "";
    let newTable = document.createElement('table');
    newTable.style.border = "2px solid black";

    divJeu.appendChild(newTable);
    let cpt = 0;
    for (let i = 0; i < size; i++) {
        let new_tr = document.createElement('tr');
        newTable.appendChild(new_tr);
        for (let j = 0; j < size; j++) {
            let new_td = document.createElement('td');
            new_tr.appendChild(new_td);
            new_td.id = cpt;
            new_td.style.border = "2px solid grey";
            new_td.style.height = sizeTd + "px";
            new_td.style.width = sizeTd + "px";
            new_td.addEventListener("mouseover", function () {
                new_td.style.border = "2px solid red";
            });
            new_td.addEventListener("mouseout", function () {
                new_td.style.border = "2px solid grey";
            });
            new_td.addEventListener("click", testCollision);
            cpt++;
        }
    }
}

/**
 * Fonction de test de collision
 * @param evt
 */
function testCollision(evt) {

    let touche = false;
    let vide = evt.target.tagName.toLowerCase() !== "img";
    if (vide) {

        let newImg = document.createElement('img');

        //test de collision
        //tableauBateaux[0] --> tableau de Portes Avions --> vide si aucuns(cas du 8*8)
        //tableauBateaux[1] --> tableau de Destroyers
        //tableauBateaux[2] --> tableau de SubMarines
        //tableauBateaux[3] --> tableau de Navires Patrouilles

        for (let i = 0; i < tabBateaux.length && !touche; i++) {

            let tabCoordonneesCourantes = tabBateaux[i];

            for (let j = 0; j < tabCoordonneesCourantes.length && !touche; j++) {
                if (parseFloat(evt.target.id) === tabCoordonneesCourantes[j]) {
                    tabCoordonneesCourantes.splice(j, 1);//je retire la coordonnée du tableau
                    touche = true;
                    majBateaux(i);
                }
            }
        }


        if (touche) {
            let sound = document.getElementById("explosion");
            sound.pause();
            sound.currentTime = 0;
            sound.play();
            newImg.src = "images/touch.gif";
            newImg.alt = "gif touché";
            score += 500;
            majScore(score);
        }
        else {
            let sound = document.getElementById("splash");
            sound.pause();
            sound.currentTime = 0;
            sound.play();
            newImg.src = "images/miss3.png";
            newImg.alt = "image miss";
            score -= 100;
            if (score >= 0) {
                majScore(score);
            }
            else {
                majScore(0);
            }

        }
        newImg.style.height = sizeimg + "px";
        newImg.style.width = sizeimg + "px";
        evt.target.innerHTML = "";
        evt.target.appendChild(newImg);
    }
}

/**
 * Fonction d'affichage en cas de victoire
 */
function victoire() {

    divVictoire.addEventListener("click", function () {
        window.location.reload();
    });

    rendu3D();
    divVictoire.classList.toggle("hidden");
    let sound = document.getElementById("victory");
    sound.play();
    let newP = document.createElement("p");
    newP.textContent = "Voici votre score : " + score.toString();
    newP.style.color = "white";
    newP.style.fontSize = "40px";
    divVictoire.appendChild(newP);
}

/**
 * Rendu 3d  pour la victoire
 */
function rendu3D() {
    let renderer, scene, camera, mesh;

    init();
    animate();

    function init() {

        // on initialise le moteur de rendu
        renderer = new THREE.WebGLRenderer();

        // si WebGL ne fonctionne pas sur le navigateur, utiliser le moteur de rendu Canvas à la place
        // renderer = new THREE.CanvasRenderer();
        renderer.setSize((window.innerWidth - 600), (window.innerHeight - 300));
        divVictoire.appendChild(renderer.domElement);

        // on initialise la scène
        scene = new THREE.Scene();

        // on initialise la camera que l’on place ensuite sur la scène
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 1000);
        scene.add(camera);

        // on créé un rectangle auquel on définie un matériau puis on l’ajoute à la scène
        // J'ai pris la base d'un cube auquel j'étend sa longueur et sa profondeur
        let geometry = new THREE.CubeGeometry(700, 300, 700);
        let material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/win.png'),
            overdraw: true
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    function animate() {
        // on appel la fonction animate() récursivement à chaque frame
        requestAnimationFrame(animate);
        // on fait tourner le cube sur son axe y
        mesh.rotation.y += 0.01;
        // on effectue le rendu de la scène
        renderer.render(scene, camera);
    }


}

/**
 * Fonction de mise à jour du scores
 * @param valeur
 */
function majScore(valeur) {
    score = parseFloat(valeur);
    document.getElementById("score").textContent = score.toString();
}

/**
 * Fonction de mise en pause du jeu
 */
function pause() {

    divPause.classList.toggle("hidden");

    if (!pauseJeu) {
        let newP = document.createElement("p");
        newP.textContent = "Pause";
        newP.style.color = "white";
        newP.style.fontSize = "200px";
        divPause.appendChild(newP);
        pauseJeu = true;
    }
    else {
        divPause.innerHTML = "";
        pauseJeu = false;
    }
}

/**
 * Fonction qui genere un nombre de bateau basé sur la difficulté
 */
function genererBateaux() {
    let retry = true;
    let inters;

    switch (size) {
        case 8:
            do {
                genererPA(0);
                genererDestroyer(2);
                genererSM(1);
                genererNavPat(2);
                inters = intersection(tabBateaux);
                if (inters !== false) {
                    positionsDestroyer = [];
                    positionsSM = [];
                    positionsNavPat = [];
                    tabBateaux = [];
                }
                else {
                    retry = false;
                }
            } while (retry !== false);
            console.log(tabBateaux); //décommenter pour afficher les positions des bateaux
            break;
        case 10:
            do {
                genererPA(1);
                genererDestroyer(3);
                genererSM(2);
                genererNavPat(2);
                inters = intersection(tabBateaux);

                if (inters !== false) {
                    positionsDestroyer = [];
                    positionsSM = [];
                    positionsNavPat = [];
                    positionsPA = [];
                    tabBateaux = [];
                }
                else {
                    retry = false;
                }
            } while (retry !== false);
            console.log(tabBateaux); //décommenter pour afficher les positions des bateaux
            break;
        case 12:
            do {
                genererPA(2);
                genererDestroyer(3);
                genererSM(3);
                genererNavPat(4);
                inters = intersection(tabBateaux);

                if (inters !== false) {
                    positionsDestroyer = [];
                    positionsSM = [];
                    positionsNavPat = [];
                    positionsPA = [];
                    tabBateaux = [];
                }
                else {
                    retry = false;
                }
            } while (retry !== false);
            console.log(tabBateaux); //décommenter pour afficher les positions des bateaux
            break;
    }
}

// // function genererBateauxBasic() { // fonction temporaire pour afficher setter les positions des bateaux a la main
//
//     tabBateaux = [];
//
//     switch (size) {
//         case 8:
//             //2 Destroyers/1 SubMarines/2 Navires Patrouille
//             positionsDestroyer = [0, 1, 2, 26, 34, 42];
//             positionsSM = [58, 59, 60];
//             positionsNavPat = [39, 47, 13, 14];
//             tabBateaux.push(positionsPA, positionsDestroyer, positionsSM, positionsNavPat);
//             break;
//         case 10:
//             //1 Porte Avion/3 Destroyers/2 SubMarines/2 Navires Patrouille
//             positionsPA = [42, 43, 44, 45];
//             positionsDestroyer = [0, 1, 2, 26, 36, 46, 93, 94, 95];
//             positionsSM = [57, 58, 59, 72, 82, 92];
//             positionsNavPat = [39, 49, 13, 14];
//             tabBateaux.push(positionsPA, positionsDestroyer, positionsSM, positionsNavPat);
//             break;
//         case 12:
//             //2 Porte Avion/3 Destroyers/3 SubMarines/4 Navires Patrouille
//             positionsPA = [76, 77, 78, 79, 125, 126, 127, 128];
//             positionsDestroyer = [0, 1, 2, 26, 38, 50, 93, 94, 95];
//             positionsSM = [58, 59, 60, 72, 84, 96, 112, 124, 136];
//             positionsNavPat = [39, 51, 13, 14, 8, 9, 142, 143];
//             tabBateaux.push(positionsPA, positionsDestroyer, positionsSM, positionsNavPat);
//             break;
//     }
// }

/**
 * Fonction pour generer les bateaux de type Destroyer
 * @param nombreBateau
 */
function genererDestroyer(nombreBateau) {
    let posInit;
    let longueur = 3;
    for (let j = 0; j < nombreBateau; j++) {
        let direction = Math.floor(Math.random() * 2);

        if (direction === 1) { // horizontal
            switch (size) {
                case 8:
                    posInit = genererNumero(longueur);
                    break;
                case 10:
                    posInit = genererNumero(longueur);
                    break;
                case 12:
                    posInit = genererNumero(longueur);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsDestroyer.push((posInit + i));
            }
        } else {
            switch (size) {
                case 8:
                    posInit = Math.floor(Math.random() * 48);
                    break;
                case 10:
                    posInit = Math.floor(Math.random() * 80);
                    break;
                case 12:
                    posInit = Math.floor(Math.random() * 120);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsDestroyer.push(posInit);
                posInit = posInit + size;
            }
        }
    }
    tabBateaux.push(positionsDestroyer); // Place le tableau courant dans le
}

/**
 * Fonction pour generer les bateaux de type Porte-Avion
 * @param nombreBateau
 */
function genererPA(nombreBateau) {
    let posInit;
    let longueur = 4;
    for (let j = 0; j < nombreBateau; j++) {
        let direction = Math.floor(Math.random() * 2);

        if (direction === 1) { // horizontal
            switch (size) {
                case 8:
                    posInit = genererNumero(longueur);
                    break;
                case 10:
                    posInit = genererNumero(longueur);
                    break;
                case 12:
                    posInit = genererNumero(longueur);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsPA.push((posInit + i));
            }
        } else {
            switch (size) {
                case 8:
                    posInit = Math.floor(Math.random() * 40);
                    break;
                case 10:
                    posInit = Math.floor(Math.random() * 70);
                    break;
                case 12:
                    posInit = Math.floor(Math.random() * 108);
                    break;
            }

            for (let i = 0; i < longueur; i++) {
                positionsPA.push(posInit);
                posInit = posInit + size;
            }
        }
    }
    tabBateaux.push(positionsPA); // Place le tableau courant dans le
}


/**
 * Fonction pour generer les bateaux de type Sous-marin
 * @param nombreBateau
 */
function genererSM(nombreBateau) {
    let posInit;
    let longueur = 3;
    for (let j = 0; j < nombreBateau; j++) {
        let direction = Math.floor(Math.random() * 2);

        if (direction === 1) {
            switch (size) {
                case 8:
                    posInit = genererNumero(longueur);
                    break;
                case 10:
                    posInit = genererNumero(longueur);
                    break;
                case 12:
                    posInit = genererNumero(longueur);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsSM.push((posInit + i));
            }
        } else {
            switch (size) {
                case 8:
                    posInit = Math.floor(Math.random() * 48);
                    break;
                case 10:
                    posInit = Math.floor(Math.random() * 80);
                    break;
                case 12:
                    posInit = Math.floor(Math.random() * 120);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsSM.push(posInit);
                posInit = posInit + size;
            }
        }

    }
    tabBateaux.push(positionsSM); // Place le tableau courant dans le
}

/**
 * Fonction pour generer les bateaux de type Navire Patrouille
 * @param nombreBateau
 */
function genererNavPat(nombreBateau) {
    let posInit;
    let longueur = 2;
    for (let j = 0; j < nombreBateau; j++) {
        let direction = Math.floor(Math.random() * 2);

        if (direction === 1) {
            switch (size) {
                case 8:
                    posInit = genererNumero(longueur);
                    break;
                case 10:
                    posInit = genererNumero(longueur);
                    break;
                case 12:
                    posInit = genererNumero(longueur);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsNavPat.push((posInit + i));
            }
        } else {
            switch (size) {
                case 8:
                    posInit = Math.floor(Math.random() * 56);
                    break;
                case 10:
                    posInit = Math.floor(Math.random() * 90);
                    break;
                case 12:
                    posInit = Math.floor(Math.random() * 132);
                    break;
            }
            for (let i = 0; i < longueur; i++) {
                positionsNavPat.push(posInit);
                posInit = posInit + size;
            }
        }

    }
    tabBateaux.push(positionsNavPat); // Place le tableau courant dans le
}


/**
 * Genere un numero basé sur le tableau
 * @param typeBateau
 * @returns {*}
 */
function genererNumero(typeBateau) {
    let tabNum = [];
    if (typeBateau === 2) {
        switch (size) {
            case 8:
                for (let i = 0; i < 63; i++) {
                    tabNum[i] = i;
                }
                for (let j = tabNum.length; j === 0; j - size) {
                    tabNum.splice(j, 1);
                }
                console.log(tabNum.length);
                return tabNum[Math.floor(Math.random() * tabNum.length)];
            case 10:
                for (let i = 0; i < 99; i++) {
                    tabNum[i] = i;
                }
                for (let j = tabNum.length; j === 0; j - size) {
                    tabNum.splice(j, 1);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
            case 12:
                for (let i = 0; i < 143; i++) {
                    tabNum[i] = i;
                }
                for (let j = tabNum.length; j === 0; j - size) {
                    tabNum.splice(j, 1);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
        }
    }
    else if (typeBateau === 3) {
        switch (size) {
            case 8:
                for (let i = 0; i < 63; i++) {
                    tabNum[i] = i;
                }
                for (let j = (tabNum.length - 2); j === 0; j - size) {
                    tabNum.splice(j, 2);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
            case 10:
                for (let i = 0; i < 99; i++) {
                    tabNum[i] = i;
                }
                for (let j = (tabNum.length - 2); j === 0; j - size) {
                    tabNum.splice(j, 2);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
            case 12:
                for (let i = 0; i < 143; i++) {
                    tabNum[i] = i;
                }
                for (let j = (tabNum.length - 2); j === 0; j - size) {
                    tabNum.splice(j, 2);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
        }
    }
    else if (typeBateau === 4) {
        switch (size) {
            case 8:
                for (let i = 0; i < 63; i++) {
                    tabNum[i] = i;
                }
                for (let j = (tabNum.length - 3); j === 0; j - size) {
                    tabNum.splice(j, 3);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
            case 10:
                for (let i = 0; i < 99; i++) {
                    tabNum[i] = i;
                }
                for (let j = (tabNum.length - 3); j === 0; j - size) {
                    tabNum.splice(j, 3);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
            case 12:
                for (let i = 0; i < 143; i++) {
                    tabNum[i] = i;
                }
                for (let j = (tabNum.length - 3); j === 0; j - size) {
                    tabNum.splice(j, 3);
                }

                return tabNum[Math.floor(Math.random() * tabNum.length)];
        }
    }
}

/**
 * Fonction de mise à jour des bateaux
 * @param i
 */
function majBateaux(i) {

    // PorteAvion - Destroyer - Submarine - Patrouille

    //tableauBateaux[0] --> tableau de Portes Avions --> vide si aucuns(cas du 8*8)
    //tableauBateaux[1] --> tableau de Destroyers
    //tableauBateaux[2] --> tableau de SubMarines
    //tableauBateaux[3] --> tableau de Navires Patrouilles
    let tabCoordonneesCourantes = tabBateaux[i];

    switch (size) {
        case 8:
            //2 Destroyers/1 SubMarines/2 Navires Patrouille

            if (i === 1) { //tableau de Destroyers ou Navires Patrouilles
                if (tabCoordonneesCourantes.length === 3
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);

                    }
                }
            }
            else if (i === 2) { //tableau de Submarines
                if (tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 3) { //Navires Patrouilles
                if (tabCoordonneesCourantes.length === 2
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }

            break;
        case 10:
            //1 Porte Avion/3 Destroyers/2 SubMarines/2 Navires Patrouille

            if (i === 0) { //tableau Porte Avion
                if (tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 1) { //tableau de Destroyers
                if (tabCoordonneesCourantes.length === 6
                    || tabCoordonneesCourantes.length === 3
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 2) //tableau de SubMarines
            {
                if (tabCoordonneesCourantes.length === 3
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 3)//tableau de Navires Patrouille
            {
                if (tabCoordonneesCourantes.length === 2
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            break;
        case 12:
            //2 Porte Avion/3 Destroyers/3 SubMarines/4 Navires Patrouille

            if (i === 0) { //tableau Porte Avion
                if (tabCoordonneesCourantes.length === 4
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 1) { //tableau de Destroyers
                if (tabCoordonneesCourantes.length === 6
                    || tabCoordonneesCourantes.length === 3
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 2) { //tableau de Submarines
                if (tabCoordonneesCourantes.length === 6
                    || tabCoordonneesCourantes.length === 3
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            else if (i === 3)//tableau de Navires Patrouilles
            {
                if (tabCoordonneesCourantes.length === 6
                    || tabCoordonneesCourantes.length === 4
                    || tabCoordonneesCourantes.length === 2
                    || tabCoordonneesCourantes.length === 0) {
                    nbBateauxCoules++;
                    nbBateauxRestants--;
                    if (tabCoordonneesCourantes.length === 0) {
                        console.log(tabCoordonneesCourantes);
                    }
                }
            }
            break;
    }

    document.getElementById("nbCoule").textContent = nbBateauxCoules.toString();
    document.getElementById("nbRestant").textContent = nbBateauxRestants.toString();

    if (nbBateauxRestants === 0)
        victoire();

}

/**
 *
 * @param tableauDeTableaux
 * @returns {boolean} true si intersection sinon false
 */
function intersection(tableauDeTableaux) {

    for (let i = 0; i < tableauDeTableaux.length; i++) {
        let tableauElementRecherche = tableauDeTableaux[i];

        for (let j = 0; j < tableauElementRecherche.length; j++) {
            let elementRecherche = tableauElementRecherche[j];

            for (let k = 0; k < tableauDeTableaux.length; k++) {
                let tableauCourant = tableauDeTableaux[k];

                for (let l = 0; l < tableauCourant.length; l++) {
                    let elementCourant = tableauCourant[l];
                    if (i === k && j === l) {
                        l++;
                    }
                    else {
                        if (elementRecherche === elementCourant) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false;
}