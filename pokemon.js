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
    getAPIData(`https://pokeapi.co/api/v2/pokemon?limit=25`).then
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
    pokeCard.addEventListener('click', () => {
        pokeCard.classList.toggle('is-flipped');
    })
    pokeCard.appendChild(populateCardFront(pokemon));
    pokeCard.appendChild(populateCardBack(pokemon));
    pokeScene.appendChild(pokeCard);
    pokeGrid.appendChild(pokeScene);
}

function populateCardFront(pokemon) {
    let cardFront = document.createElement('div');
    
    if(pokemon.types.length == 2) {
        let typeConcat = "";
        for(let i = 0; i < pokemon.types.length; i++) {
            typeConcat += pokemon.types[i].type.name+"-";
        }
        typeConcat += "type";
        cardFront.className = `card_face ${typeConcat}`;
    }
    else {
        cardFront.className = `card_face ${pokemon.types[0].type.name}-type`;
    }
    let frontLabel = document.createElement('p');
    let frontImage = document.createElement('img');
    frontLabel.textContent = pokemon.name;
    frontImage.src = `../playing-cards/poke-imgs/${getImageFileName(pokemon)}.png`;
    cardFront.appendChild(frontImage);
    cardFront.appendChild(frontLabel);
    return cardFront;
}

function populateCardBack(pokemon) {
    let cardBack = document.createElement('div');
    cardBack.className = `card_face card_face_back`;
    let backLabel = document.createElement('p');
    backLabel.textContent = "Back of card";
    cardBack.appendChild(backLabel);
    return cardBack;
}

function getImageFileName(pokemon) {
    if(pokemon.id < 10) {
        return `00${pokemon.id}`;
    }
    else if(pokemon.id > 9 && pokemon.id < 99) {
        return `0${pokemon.id}`;
    }
    else if(pokemon.id > 99) {
        return pokemon.id;
    }
}

loadPage();