// https://pokeapi.co/api/v2/pokemon?limit=40&offset=0

const allPokemon = [];

let searchResults = [];

let offset = 0;
const limit = 40;

async function loadPokemon(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

function renderPokemonList() {
	const listRef = document.getElementById("cardList");
	listRef.innerHTML = "";

	for (let i = 0; i < allPokemon.length; i++) {
		const pokemon = allPokemon[i];
		listRef.innerHTML += /*html*/ `

            <li>
                <button data-id="card">
                    <span>#${pokemon.id}</span>
                    <h2>${pokemon.name}</h2>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                 </button>
            </li>
        `;
	}
}

async function loadPokemonList() {
	const response = await fetch(
		"https://pokeapi.co/api/v2/pokemon?limit=40&offset=0",
	);
	const responseFromJSON = await response.json();

	const promises = responseFromJSON.results.map((entry) =>
		loadPokemon(entry.url),
	);
	const loaded = await Promise.all(promises);

	allPokemon.push(...loaded);
	renderPokemonList();
}

loadPokemonList();
