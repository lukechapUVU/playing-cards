async function getAPIData(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }
    catch (error) {
        console.error(error);
    }
}

function loadPage() {
    getAPIData(`https://pokeapi.co/api/v2/pokemon`).then
    (async (data) => {
        for(const pokemon of data.results) {
            await getAPIData(pokemon.url).then((pokeData) => {
                populatePokeCard(pokeData);
            })
        }
    })

}

const pokeGrid = document.querySelector('.pokeGrid');

function populatePokeCard(pokemon) {
    let pokeScene = document.createElement('div');
    pokeScene.className = 'scene';
    let pokeCard = document.createElement('div');
    pokeCard.className = 'card';
    let cardFront = document.createElement('div');
    let frontLabel = document.createElement('p');
    let cardBack = document.createElement('div');
    let backLabel = document.createElement('p');

    frontLabel.textContent = pokemon.name;
    backLabel.textContent = "Back of card";
    cardFront.appendChild(frontLabel);
    cardBack.appendChild(backLabel);
    pokeCard.appendChild(cardFront);
    pokeCard.appendChild(cardBack);
    pokeScene.appendChild(pokeCard);
    pokeGrid.appendChild(pokeScene);
}

loadPage();