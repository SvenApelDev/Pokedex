
function getCardTemplate(pokemon) {
    const cardColor = typeColors[pokemon.types[0].type.name];
    return /*html*/ `
        <li class="card-character" style="background-color: ${cardColor}">
            <button data-id="card" onclick="openDialog(${pokemon.id})" aria-label="${pokemon.name}">
                <span>#${pokemon.id}</span>
                <h2>${pokemon.name}</h2>
                <img data-id="card-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
                <div class="types">${renderTypes(pokemon)}</div>
            </button>
        </li>
    `;
}

function getDialogTemplate(pokemon) {
    return /*html*/ `
        <h2>${pokemon.name}</h2>
        <img data-id="dialog-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="" />
        <div class="content-stats">
            <ul class="stats">${renderStats(pokemon)}</ul>
        </div>
    `;
}

function getNotFoundTemplate() {
    return /*html*/`
		<p data-id="not-found">No match found.</p>
	`;
}