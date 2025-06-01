// ==== Sélections ==== 
// Rechercher pokémon
const inputSearchPokemon    = document.querySelector("#search-pokemon");
const btnSearch             = document.querySelector(".btn-search");

// Filtrer pokemon
const btnContainer          = document.querySelector(".container-btn");

// Afficher pokemon
const displaySelected       = document.querySelector(".display-selected");
const displayPokemon        = document.querySelector(".display-pokemon");

// ==== Fonctions utilitaires ====
function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (content) {
        element.innerHTML = content;
    }
    return element;
}
function appendElement(parent, child) {
    parent.append(child);
}

// ==== Fonctions Fetch => API ====
async function getApi() {
    try {
        const response = await fetch(`https://tyradex.app/api/v1/pokemon`);
        const data = await response.json();

        console.log(data, "data");
        
        return data
    }
    catch (error) {
        console.error(error);
    }
}


async function getApiSearchedPokemon(inputValue) {
    try {
        const response = await fetch(`https://tyradex.app/api/v1/pokemon/${inputValue}`);
        const data = await response.json();

        console.log(data, "data");
        
        return data
    }
    catch (error) {
        console.error(error);
    }
}

// ==== Fonctions Display API ====
async function displayApi(showAll = false) {
    const pokemon = await getApi();
    displayPokemon.innerHTML = "";

    // Détermine combien de Pokémon afficher
    const pokemonToDisplay = showAll ? pokemon.slice(1) : pokemon.slice(1, 25);

    pokemonToDisplay.forEach(element => {
        const figure = createElement("figure", "card", "")
        const image  = createElement("img", "", "")
        image.setAttribute("src", `${element.sprites.regular}`);
        image.setAttribute("alt", `${element.name.fr}`);
        const figcaption =  createElement("figcaption", "", `<p>${element.name.fr}</p>`);
        appendElement(figure, image);
        appendElement(figure, figcaption);
        appendElement(displayPokemon, figure);
    });
}
displayApi()

async function displaySearchedPokemon() {
    const inputValue = inputSearchPokemon.value;

    if (inputValue === "") {
        console.log("Veuillez compléter les champs");

    } else {
        const pokemon = await getApiSearchedPokemon(inputValue);
        displaySelected.innerHTML = "";

        // ---- Carte pokémon ----
        const figure = createElement("figure", "card", "")
        const image  = createElement("img", "", "")
        image.setAttribute("src", `${pokemon.sprites.regular}`);
        image.setAttribute("alt", `${pokemon.sprites.regular}`);

        // Légende et détails du pokémon
        const figcaption =  createElement("figcaption", "", 
            `
            <p>Nom : <span>${pokemon.name.fr}</span></p> 
            <p>Génération : <span>${pokemon.generation}</span></p>
            <p>Catégorie : <span>${pokemon.category}</span></p>
            <p>Type : <span><img src="${pokemon.types[0].image}" alt=""> ${pokemon.types[0].name}</span></p>
            <p>Talents : <span>${pokemon.talents[0].name}</p>
            <p>Hp : <span>${pokemon.stats.hp}</span></p>
            <p>Attaque : <span>${pokemon.stats.atk}</span></p>
            <p>Défense : <span>${pokemon.stats.def}</span></p>
            <p>Attaque spéciale : <span>${pokemon.stats.spe_atk}</span></p>
            <p>Défense spéciale : <span>${pokemon.stats.spe_def}</span></p>
            <p>Vitesse : <span>${pokemon.stats.vit}</span></p>
            `);

        // Close-btn
        const btnClose = createElement("div", "close-btn", `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#F3F3F3"><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/></svg>`)

        // ---- Ajouter au DOM ----
        appendElement(displaySelected, btnClose);
        appendElement(displaySelected, figure);
        appendElement(figure, image);
        appendElement(figure, figcaption);

        displaySelected.classList.toggle("active");

        btnClose.addEventListener("click", function () {
            displaySelected.classList.toggle("active");
        })
    }
}

async function displayApiFiltered(typePoke) {
    const pokemon = await getApi();
    displayPokemon.innerHTML = "";

    const filteredPokemon = pokemon.filter(element => {return element.types && element.types.some(incType => incType.name === typePoke)})
    
    filteredPokemon.forEach(element => {
        const figure = createElement("figure", "card", "")
        const image  = createElement("img", "", "")
        image.setAttribute("src", `${element.sprites.regular}`);
        image.setAttribute("alt", `${element.name.fr}`);
        const figcaption =  createElement("figcaption", "", `<p>${element.name.fr}</p>`);
        appendElement(figure, image);
        appendElement(figure, figcaption);
        appendElement(displayPokemon, figure);
    });
}

// ==== Evénements ====
btnSearch.addEventListener("click", function (e) {
    e.preventDefault();

    displaySearchedPokemon();
})

btnContainer.addEventListener("click", function (event) {
    if (event.target.dataset.type !== "All") {
        displayApiFiltered(event.target.dataset.type)
    } else {
        displayApi(true)
    }
})


displayPokemon.addEventListener("click", function (event) {
    
    const card = event.target.closest(".card");
    if (card) {
        // Extraire le nom du Pokémon de la carte cliquée
        const nameCard = card.querySelector("figcaption p:first-child").textContent.trim();

        // Placer le nom dans l'input de recherche
        inputSearchPokemon.value = nameCard;

        // Appeler la fonction pour afficher les détails du Pokémon
        displaySearchedPokemon();

        // Réinitialiser l'input après l'affichage (optionnel)
        inputSearchPokemon.value = "";
    }
})
