const characterForm = document.querySelector("#characterForm");

characterForm.addEventListener("submit", searchCharacters);

async function searchCharacters(event) {
    event.preventDefault();

    const characterName =
        document.querySelector("#characterName").value.trim();

    const characterStatus =
        document.querySelector("#characterStatus").value;

    const message =
        document.querySelector("#message");

    message.textContent = "";

    if (characterName === "") {
        message.textContent = "Please enter a character name.";
        return;
    }

    let url =
        "https://rickandmortyapi.com/api/character/?name=" +
        characterName;

    if (characterStatus !== "") {
        url += "&status=" + characterStatus;
    }

    try {

        let response = await fetch(url);

        let data = await response.json();

        let characterResults =
            document.querySelector("#characterResults");

        // Removes previous search results
        characterResults.replaceChildren();

        // Displays a message if no characters are found
        if (!data.results) {
            message.textContent = "No characters found.";
            return;
        }

        data.results.forEach(function (character) {

            let characterCard =
                document.createElement("div");

            // Creates the character image
            let imageElement =
                document.createElement("img");

            imageElement.src = character.image;
            imageElement.alt = character.name;

            // Creates the character name
            let nameElement =
                document.createElement("h2");

            nameElement.textContent = character.name;

            // Creates the character status
            let statusElement =
                document.createElement("p");

            statusElement.textContent =
                "Status: " + character.status;

            // Creates the character species
            let speciesElement =
                document.createElement("p");

            speciesElement.textContent =
                "Species: " + character.species;

            // Creates the character gender
            let genderElement =
                document.createElement("p");

            genderElement.textContent =
                "Gender: " + character.gender;

            // Adds all elements to the character card
            characterCard.append(imageElement);
            characterCard.append(nameElement);
            characterCard.append(statusElement);
            characterCard.append(speciesElement);
            characterCard.append(genderElement);

            // Displays the character card
            characterResults.append(characterCard);

        });

    }
    catch (err) {

        alert(err);

    }
}