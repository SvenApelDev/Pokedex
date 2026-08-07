function getCardTemplate(pokemon) {
    const mainType = pokemon.types[0];
	const cardColor = typeColors[mainType];
	return /*html*/ `
        <li class="card-character" style="background-color: ${cardColor}">
            <button data-id="card" onclick="openDialog(${pokemon.id})" aria-label="${pokemon.name}">
                <div class="card-header">
                    <span class="pkm-id">${pokemon.id}</span>
                    <h2 class="pkm-headline">${pokemon.name}</h2>
                </div>
                <img data-id="card-image" src="${pokemon.image}" alt="${pokemon.name}">
                <div class="types">${renderTypes(pokemon)}</div>
            </button>
        </li>
    `;
}

function getDialogTemplate(pokemon) {
    const mainType = pokemon.types[0];
	const color = typeColors[mainType];
	return /*html*/ `
        <div class="dialog-content">
            <div class="dialog-header" style="background-color: ${color}">
                <span class="pkm-id">No. ${pokemon.id}</span>
                <h2>${pokemon.name}</h2>
            </div>
            <div class="dialog-body" style="background-color: ${color}40">
                <img class="dialog-img" data-id="dialog-image" src="${pokemon.image}" alt="" />       
                <div class="dialog-details">
                    <div class="tab-buttons" style="background-color: ${color}">
                        <button onclick="switchTab('main')">Main</button>
                        <button onclick="switchTab('stats')">Stats</button>
                    </div>
                    <div class="tab-content" style="background-color: ${color}99">
                    ${getTabContent(pokemon)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAbilities(pokemon) {
	return pokemon.abilities.join(", ");
}

function getMainTab(pokemon) {
	const heightMeters = (pokemon.height / 10).toFixed(1);
	const weightKg = (pokemon.weight / 10).toFixed(1);
	return /*html*/ `
        <ul class="main">
            <li class="info-row">
                <span class="label">Height</span>
                <span class="value">${heightMeters} m</span>
            </li>
            <li class="info-row">
                <span class="label">Weight</span>
                <span class="value">${weightKg} kg</span>
            </li>
            <li class="info-row">
                <span class="label">Base experience</span>
                <span class="value">${pokemon.baseExperience}</span>
            </li>
            <li class="info-row info-row-wide">
                <span class="label">Abilities</span>
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

function getTabContent(pokemon) {
	if (activeTab === "main") {
		return getMainTab(pokemon);
	} else if (activeTab === "stats") {
		return getStatsTab(pokemon);
	}
}

function getNotFoundTemplate() {
	return /*html*/ `
		<p data-id="not-found">No match found.</p>
	`;
}
