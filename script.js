// https://pokeapi.co/api/v2/pokemon?limit=40&offset=0

const allPokemon = [];

let searchResults = [];

let offset = 0;
const limit = 40;

//#region Renders

function renderPokemonList(pkmListToRender) {
	const listRef = document.getElementById("cardList");
	listRef.innerHTML = "";

	for (let i = 0; i < pkmListToRender.length; i++) {
		const pokemon = pkmListToRender[i];
		const cardColor = typeColors[pokemon.types[0].type.name];
		listRef.innerHTML += /*html*/ `

            <li class="card-character" style="background-color: ${cardColor}">
                <button data-id="card" onclick="openDialog(${pokemon.id})">
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

function renderStats(pokemon) {
	return pokemon.stats
		.map((entry) => `<li>${entry.stat.name}: ${entry.base_stat}</li>`)
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
	renderPokemonList(allPokemon);

	offset += limit;
}

loadPokemonList();

async function loadMore() {
	const loaderRef = document.getElementById("loader");
	const buttonRef = document.querySelector('[data-id="load-more-button"]');

	loaderRef.classList.remove("d-none");
	buttonRef.disabled = true;

	await loadPokemonList();

	loaderRef.classList.add("d-none");
	buttonRef.disabled = false;
}

const dialogRef = document.querySelector('[data-id="dialog"]');

dialogRef.addEventListener("click", (event) => {
	if (event.target === dialogRef) {
		closeDialog();
	}
});

dialogRef.addEventListener("close", () => {
	document.body.classList.remove("no-scroll");
});

function openDialog(pokemonId) {
	displayImg = allPokemon.findIndex(p => p.id === pokemonId);
	renderDialog(displayImg);
	dialogRef.showModal();
	document.body.classList.add("no-scroll");
}

function closeDialog() {
	dialogRef.close();
}

function renderNotFoundMessage() {
    const listRef = document.getElementById("cardList");
	listRef.innerHTML = /*html*/`
		<p data-id="not-found">No match found.</p>
	`;
}

function renderDialog(i) {
	const pokemon = allPokemon[i];
	const contentRef = document.querySelector(
		'[data-id="overlay-pokemon-name"]',
	);

	contentRef.innerHTML = /*html*/ `
        <h2>${pokemon.name}</h2>
        <img data-id="dialog-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="" />
        <div class="content-stats">
            <ul class="stats">${renderStats(pokemon)}</ul>
        </div>
    `;
}

function nextImg(backForward) {
	if (backForward === "forward") {
		displayImg = (displayImg + 1) % allPokemon.length;
	} else if (backForward === "back") {
		displayImg = (displayImg + allPokemon.length - 1) % allPokemon.length;
	}
	renderDialog(displayImg);
}

function searchPokemon() {
	const searchInput = document.querySelector('[data-id="search-input"]').value.toLowerCase().trim();

	if (searchInput.length === 0) {
		renderPokemonList(allPokemon);
		return;
	}

	if (searchInput.length < 3) {
		return;
	}

	searchFilterRender(searchInput);
}

function searchFilterRender(searchInput) {
	const filterPokemon = allPokemon.filter(pokemon =>
		pokemon.name.includes(searchInput)
	);

	if (filterPokemon.length > 0) {
		renderPokemonList(filterPokemon);
	} else {
		renderNotFoundMessage();
	}
}



	

//#endregion

//#region Helpers

//#endregion
