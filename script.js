const allPokemon = [];
let searchResults = [];

let offset = 0;
const limit = 40;

const dialogRef = document.querySelector('[data-id="dialog"]');

let activeTab = "main";

dialogRef.addEventListener("click", (event) => {
	if (event.target === dialogRef) {
		closeDialog();
	}
});

dialogRef.addEventListener("close", () => {
	document.body.classList.remove("no-scroll");
});

//#region ------ LOADS ------

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

async function loadMore() {
	const loaderRef = document.getElementById("loader");
	const buttonRef = document.querySelector('[data-id="load-more-button"]');
	loaderRef.classList.remove("d-none");
	buttonRef.disabled = true;
	await loadPokemonList();
	loaderRef.classList.add("d-none");
	buttonRef.disabled = false;
}

//#endregion
//#region ------ RENDERS ------

function renderPokemonList(pkmListToRender) {
	const listRef = document.getElementById("cardList");
	listRef.innerHTML = "";
	for (let i = 0; i < pkmListToRender.length; i++) {
		const pokemon = pkmListToRender[i];
		listRef.innerHTML += getCardTemplate(pokemon);
	}
}

function renderTypes(pokemon) {
	return pokemon.types
		.map((entry) => {
			const pillColor = typeColors[entry.type.name];
			return `<span class="type" style="background-color: ${pillColor}">${entry.type.name}</span>`;
		})
			.join("");
}

function renderStats(pokemon) {
	return pokemon.stats
		.map((entry) => {
			const percentBar = (entry.base_stat / 255) * 100;
			return `
				<li class="stat-row">
					<span class="stat-name">${entry.stat.name}</span>
					<span class="stat-value">${entry.base_stat}</span>
					<div class="stat-bar">
						<div class="stat-fill" style="width: ${percentBar}%"></div>
					</div>
				</li>			
			`;
		})
		.join("");
}

function renderDialog(i) {
	const pokemon = allPokemon[i];
	const contentRef = document.querySelector(
		'[data-id="overlay-pokemon-name"]',
	);
	contentRef.innerHTML = getDialogTemplate(pokemon);
}

function switchTab(tabName) {
	activeTab = tabName;
	renderDialog(displayImg);
}

function renderNotFoundMessage() {
	const listRef = document.getElementById("cardList");
	listRef.innerHTML = getNotFoundTemplate();
}

//#endregion
//#region ------ DIALOG CONTROLS ------

function openDialog(pokemonId) {
	displayImg = allPokemon.findIndex((p) => p.id === pokemonId);
	renderDialog(displayImg);
	dialogRef.showModal();
	document.body.classList.add("no-scroll");
}

function closeDialog() {
	dialogRef.close();
}

function nextImg(backForward) {
	if (backForward === "forward") {
		displayImg = (displayImg + 1) % allPokemon.length;
	} else if (backForward === "back") {
		displayImg = (displayImg + allPokemon.length - 1) % allPokemon.length;
	}
	renderDialog(displayImg);
}

//#endregion
//#region ------ SEARCH ------

function searchPokemon() {
	const searchInput = document
		.querySelector('[data-id="search-input"]')
		.value.toLowerCase()
		.trim();
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
	const filterPokemon = allPokemon.filter((pokemon) =>
		pokemon.name.includes(searchInput),
	);
	if (filterPokemon.length > 0) {
		renderPokemonList(filterPokemon);
	} else {
		renderNotFoundMessage();
	}
}

//#endregion
//#region ------ INIT ------

loadPokemonList();

//#endregion
