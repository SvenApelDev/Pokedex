// https://pokeapi.co/api/v2/pokemon?limit=40&offset=0

const allPokemon = [];

let searchResults = [];

let offset = 0;
const limit = 40;

//#region Renders

function renderPokemonList() {
	const listRef = document.getElementById("cardList");
	listRef.innerHTML = "";

	for (let i = 0; i < allPokemon.length; i++) {
		const pokemon = allPokemon[i];
		const cardColor = typeColors[pokemon.types[0].type.name];
		listRef.innerHTML += /*html*/ `

            <li class="card-character" style="background-color: ${cardColor}">
                <button data-id="card">
                    <span>#${pokemon.id}</span>
                    <h2>${pokemon.name}</h2>
                    <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
                    <div class="types">${renderTypes(pokemon)}</div>
                </button>
            </li>
        `;
	}
}

function renderTypes(pokemon) {
	return pokemon.types
		.map((entry) => `<span class="type">${entry.type.name}</span>`)
		.join("");
}

//#endregion

//#region Loads

async function loadPokemon(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

async function loadPokemonList() {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
	);
	const responseFromJSON = await response.json();

	const promises = responseFromJSON.results.map((entry) =>
		loadPokemon(entry.url),
	);
	const loaded = await Promise.all(promises);

	allPokemon.push(...loaded);
	renderPokemonList();

	offset += limit;
}

loadPokemonList();

async function loadMore() {
    const loaderRef = document.getElementById("loader");
    const buttonRef = document.querySelector('[data-id="load-more-button"]');

    // 1. Loader zeigen + Button sperren

    loaderRef.classList.remove("d-none");
    buttonRef.disabled = true;

    // 2. Warten, bis geladen

    await loadPokemonList();

    // 3. Loader verstecken + Button entsprerren

    loaderRef.classList.add("d-none");
    buttonRef.disabled = false;
}

//#endregion

//#region Helpers

//#endregion
