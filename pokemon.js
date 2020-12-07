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
    let frontLabel = document.createElement('h3');
    let frontImage = document.createElement('img');
    frontLabel.textContent = capitalizeFirstLetter(pokemon.name);
    frontImage.src = `../playing-cards/poke-imgs/${getImageFileName(pokemon)}.png`;
    cardFront.appendChild(frontImage);
    cardFront.appendChild(frontLabel);
    return cardFront;
}

function populateCardBack(pokemon) {
    let cardBack = document.createElement('div');
    cardBack.className = `card_face card_face_back`;

    let backLabelHeader = document.createElement('h3');
    backLabelHeader.textContent = "Stats";
    cardBack.appendChild(backLabelHeader);

    let backLabelType = document.createElement('p');
    backLabelType.textContent = `Type: `;
    for(let i = 0; i < pokemon.types.length; i++) {
        backLabelType.textContent += `${pokemon.types[i].type.name}`;
        backLabelType.textContent += `-`;
    }
    backLabelType.textContent = backLabelType.textContent.substring(0,backLabelType.textContent.length-1);
    cardBack.appendChild(backLabelType);

    let backLabelHeightWeight = document.createElement('p');
    backLabelHeightWeight.textContent = `Height: ${pokemon.height}\nWeight: ${pokemon.weight}`;
    cardBack.appendChild(backLabelHeightWeight);

    let backLabelStats = document.createElement('p');
    for(let i = 0; i < pokemon.stats.length; i++) {
        backLabelStats.textContent += `${capitalizeFirstLetter(pokemon.stats[i].stat.name)}: ${pokemon.stats[i].base_stat}\n`;
    }
    cardBack.appendChild(backLabelStats);

    for(let i = 0; i < pokemon.types.length; i++) {
        let backLabelTypeLogo = document.createElement('img');
        backLabelTypeLogo.src = `../playing-cards/type-imgs/${pokemon.types[i].type.name}-type.jpg`;
        cardBack.appendChild(backLabelTypeLogo);
    }

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

function capitalizeFirstLetter(name) {
    return name[0].toUpperCase()+name.substring(1);
}

loadPage();