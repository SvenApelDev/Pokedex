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

const inputRef = document.querySelector('[data-id="search-input"]');
const searchBtnRef = document.querySelector('[data-id="search-button"]');

inputRef.addEventListener("input", () => {
	searchBtnRef.disabled = inputRef.value.trim().length < 3;
});

const searchFormRef = document.querySelector(".search-content form");

searchFormRef.addEventListener("submit", (event) => {
    event.preventDefault();
    searchPokemon();
});

//#region ------ DATA TRANSFORMER ------

function transformPkmData(rawPkmData) {
	return {
		id: rawPkmData.id,
		name: rawPkmData.name,
		height: rawPkmData.height,
		weight: rawPkmData.weight,
		baseExperience: rawPkmData.base_experience,
		image: rawPkmData.sprites.other["official-artwork"].front_default,
		types: rawPkmData.types.map((t) => t.type.name),
		abilities: rawPkmData.abilities.map((a) => a.ability.name),
		stats: rawPkmData.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
        })),
	};
}

//#endregion
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
	const transformed = loaded.map(transformPkmData);

	allPokemon.push(...transformed);
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
	document.getElementById("notFound").classList.add("d-none");
	listRef.innerHTML = "";
	for (let i = 0; i < pkmListToRender.length; i++) {
		const pokemon = pkmListToRender[i];
		listRef.innerHTML += getCardTemplate(pokemon);
	}
}

function renderTypes(pokemon) {
	return pokemon.types
		.map((typeName) => {
			const pillColor = typeColors[typeName];
			return `<span class="type" style="background-color: ${pillColor}">${typeName}</span>`;
		})
			.join("");
}

function renderStats(pokemon) {
	return pokemon.stats
		.map((entry) => {
			const percentBar = (entry.value / 255) * 100;
			return `
				<li class="stat-row">
					<span class="stat-name">${entry.name}</span>
					<div class="stat-track">
						<div class="stat-bar">
							<div class="stat-fill" style="width: ${percentBar}%"></div>
						</div>
						<span class="stat-value">${entry.value}</span>
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
	const listRef = document.getElementById("notFound");
	notFoundRef.classList.remove("d-none");
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
	const notFoundRef = document.getElementById("notFound");
	const filterPokemon = allPokemon.filter((pokemon) =>
		pokemon.name.includes(searchInput),
	);
	if (filterPokemon.length > 0) {
		notFoundRef.classList.remove("d-none");
		renderPokemonList(filterPokemon);
	} else {
		notFoundRef.classList.remove("d-none");
	}
}

function resetToList() {
    inputRef.value = "";
    searchBtnRef.disabled = true;
    document.getElementById("notFound").classList.add("d-none");
    renderPokemonList(allPokemon);
}

//#endregion
//#region ------ INIT ------

loadPokemonList();

//#endregion
