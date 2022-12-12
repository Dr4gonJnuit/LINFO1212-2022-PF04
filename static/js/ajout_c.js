function ajout_c(val) {
    const elem = document.createElement("li");
    const textElem = document.createTextNode(val);

    elem.appendChild(textElem);

    document.getElementById("chara_poss").appendChild(elem);
}