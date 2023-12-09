// Open the database
let request = indexedDB.open('CocktailsDB', 1);
//We obtain the favorites from the browser database and add them to a new card
request.onsuccess = function (favoritesContainer) {
    let db = favoritesContainer.target.result;
    let tx = db.transaction('favorites', 'readwrite');
    let store = tx.objectStore('favorites');
    // Get data from the Cocktails API
    store.getAll().onsuccess = function (favoritesContainer) {
        let cocktails = favoritesContainer.target.result;

        //with the for loop we go through the favorites to add them
        for (let i = 0; i < cocktails.length; i++) {
            let newCard = createCocktailCard(cocktails[i], store);
            document.getElementById('favoritesContainer').appendChild(newCard);
        }
    };
    function createCocktailCard(cocktail) {
        let newCard = document.createElement('div');
        newCard.className = 'card text-center';
        newCard.style.width = '15rem';

        let title = document.createElement('h5');
        title.className = 'card-title';  
        title.innerText = cocktail.name;

        let image = document.createElement('img');
        image.className = 'card-img-top';  
        image.src = cocktail.image;

        let label = document.createElement('label');
        label.textContent = 'Rename : ';     
        // Create an input field for the new cocktail name
        let inputUpdate = document.createElement('input');
        inputUpdate.type = 'text';
        inputUpdate.className = 'form-control';  
        inputUpdate.value = " ";

        let buttonUpdate = document.createElement('button');
        buttonUpdate.className = 'btn btn-primary';  
        buttonUpdate.innerText = 'Update';

        let buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn btn-danger';  
        buttonDelete.innerText = 'Delete';

        buttonUpdate.addEventListener('click', function () {
            updateCocktail(cocktail.name, inputUpdate.value);
        });
        buttonDelete.addEventListener('click', function () {
            removeCocktail(cocktail.name, cocktail.image);
        });
        //Create a container for the body of the card
        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';  

        cardBody.appendChild(title);
        cardBody.appendChild(label);
        cardBody.appendChild(inputUpdate);
        cardBody.appendChild(buttonUpdate);
        cardBody.appendChild(buttonDelete);
        newCard.appendChild(image);
        newCard.appendChild(cardBody);
        return newCard;
    }

    function updateCocktail(oldCocktailName, newCocktailName) {
        let transaction = db.transaction(['favorites'], 'readwrite');
        let store = transaction.objectStore('favorites');
        //Gets the cocktail to be updated
        let getRequest = store.get(oldCocktailName);
        getRequest.onsuccess = function () {
            let data = getRequest.result;
            //Update the name of the cocktail
            data.name = newCocktailName;
            // Save the updated cocktail in the database
            let putRequest = store.put(data);
            putRequest.onsuccess = function () {
                // Drop the old cocktail
                let deleteRequest = store.delete(oldCocktailName);
                deleteRequest.onsuccess = function () {
                    location.reload();
                };
            };
        };
    }
    //function to delete a cocktail
    function removeCocktail(cocktailName, cocktailImage) {
        let transaction = db.transaction(['favorites'], 'readwrite');
        let store = transaction.objectStore('favorites');
        let request = store.delete(cocktailName, cocktailImage);

        request.onsuccess = function () {
            location.reload();
        }
    }
};