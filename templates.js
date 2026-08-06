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
       
        <div class="tab-buttons">
            <button onclick="switchTab('main')">Main</button>
            <button onclick="switchTab('stats')">Stats</button>
            <button onclick="switchTab('evo')">Evo</button>

        </div>
        <div class="tab-content">
            ${getTabContent(pokemon)}
        </div>
    `;
}

function renderAbilities(pokemon) {
    return pokemon.abilities.map(entry => entry.ability.name).join(', ');
}

function getMainTab(pokemon) {
    const heightMeters = (pokemon.height / 10).toFixed(1);
    const weightKg = (pokemon.weight / 10).toFixed(1);
	return /*html*/ `
        <ul>
            <li class="info-row">
                <span class="label">Height</span>
                <span class="separator">:</span>
                <span class="value">${heightMeters} m</span>
            </li>
            <li class="info-row">
                <span class="label">Weight</span>
                <span class="separator">:</span>
                <span class="value">${weightKg} kg</span>
            </li>
            <li class="info-row">
                <span class="label">Base experience</span>
                <span class="separator">:</span>
                <span class="value">${pokemon.base_experience}</span>
            </li>
            <li class="info-row">
                <span class="label">Abilities</span>
                <span class="separator">:</span>
                <span class="value">${renderAbilities(pokemon)}</span>
            </li>
        </ul>
    `;
}

function getStatsTab(pokemon) {
	return /*html*/ `
        <ul class="stats">${renderStats(pokemon)}</ul>
    `;
}

function getEvoTab(pokemon) {
	return "EVO kommt später hier.";
}

function getTabContent(pokemon) {
	if (activeTab === "main") {
		return getMainTab(pokemon);
	} else if (activeTab === "stats") {
		return getStatsTab(pokemon);
	} else if (activeTab === "evo") {
		return getEvoTab(pokemon);
	}
}

function getNotFoundTemplate() {
	return /*html*/ `
		<p data-id="not-found">No match found.</p>
	`;
}
