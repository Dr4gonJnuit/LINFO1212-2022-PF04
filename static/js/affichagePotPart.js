function affichagePotPart() {

    const partLisi = document.getElementById('partPotText').innerText;

    let arrayOfPartLisi = partLisi.split(',');

    let verif;
    let currentName;

    for (const iterator of arrayOfPartLisi) {

        if (iterator === "N") {
            verif = iterator;
        } else if (iterator === "C") {

            verif = iterator;

            let lab = document.createElement('label');
            let labText = document.createTextNode(" Caractéristique(s) en commun : ");
            lab.setAttribute('for', currentName);
            lab.appendChild(labText);

            document.getElementById('partPot').insertBefore(lab, document.getElementById(currentName));

        } else if (iterator !== verif && verif === "N") {

            currentName = iterator;

            let input = document.createElement('input');
            input.type = "checkbox";
            input.name = "PotPart";
            input.id = iterator;
            input.value = iterator;

            let lab = document.createElement('label');
            let labText = document.createTextNode("Nom : " + iterator);
            lab.setAttribute('for', iterator);
            lab.appendChild(labText);

            document.getElementById('partPot').appendChild(input);
            document.getElementById('partPot').insertBefore(lab, document.getElementById(iterator));

        } else if (iterator !== verif && verif === "C") {

            if (iterator === "null") {
                let lab = document.createElement('label');
                let labText = document.createTextNode("aucune caractéristique en commun ");
                lab.setAttribute('for', currentName);
                lab.appendChild(labText);

                document.getElementById('partPot').insertBefore(lab, document.getElementById(currentName));
                continue;
            }
            
            let lab = document.createElement('label');
            let labText = document.createTextNode(iterator + " ");
            lab.setAttribute('for', currentName);
            lab.appendChild(labText);

            document.getElementById('partPot').insertBefore(lab, document.getElementById(currentName));
        }
    }
}