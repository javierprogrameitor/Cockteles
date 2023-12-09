//I take from the DOM all the functionalities that I introduce in variables
let elementImageAle = document.getElementById("imagenCocktelAle");
let elementImage = document.getElementById("imagenCocktel");
let elementNameAle = document.getElementById("nameAle");
let elementName = document.getElementById("name");
let ingredients1 = document.getElementById("ingredients1");
let ingredients2 = document.getElementById("ingredients2");
let instruccions = document.getElementById("instruccions");
let button = document.getElementById("changeCocktel");
let container = document.getElementById("cocktailContainer");
let searchForm = document.querySelector("form");
let favorite =document.getElementById('favorite');




const cocktelAPI = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
/*Function to randomly get cocktails from the API*/
function getCocktelRamdom() {
    fetch(cocktelAPI)
        .then(response => response.json())
        .then(data => {
            elementImageAle.src = data.drinks[0].strDrinkThumb;
            elementNameAle.innerHTML = data.drinks[0].strDrink;

        })
        .catch(error => console.error('Error fetching Cocktail:', error));
}

button.addEventListener('click', getCocktelRamdom);

//Call getRandomCocktail on page load to display a random cocktail initially.
window.onload = getCocktelRamdom;

const cocktailAPINombre = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;

//Add an event listener to the form to handle the search
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let searchValue = event.target.querySelector('input').value;
    // Call the getCocktailByName function with the search value
    getCocktailByName(searchValue);
});

function getCocktailByName(name) {
    // Build the API URL + name
    let apiURL = cocktailAPINombre + name;
    // Make the API request
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // Display the results
            elementName.innerHTML = "Name: " + data.drinks[0].strDrink;
            ingredients1.innerHTML = "1º Ingredients: " + data.drinks[0].strIngredient1;
            ingredients2.innerHTML = "2º Ingredients: " + data.drinks[0].strIngredient2;
            elementImage.src = data.drinks[0].strDrinkThumb;
            instruccions.innerHTML = "Instructions: " + data.drinks[0].strInstructions;
        })
        .catch(error => console.error('Error fetching Cocktail:', error));
}
//Function that introduces favorite cocktails into indexeddb
favorite.addEventListener('click', function () {
    let cocktailName = document.getElementById('name').innerText;
    let cocktailImage = document.getElementById('imagenCocktel').src;
    // Open database
    let request = indexedDB.open('CocktailsDB', 1);

    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        if (!db.objectStoreNames.contains('favorites')) {
            db.createObjectStore('favorites', { keyPath: 'name' });
        }
    };
    request.onsuccess = function (e) {
        let db = e.target.result;
        let tx = db.transaction('favorites', 'readwrite');
        let store = tx.objectStore('favorites');
        // Store the cocktail in the database
        store.put({ name: cocktailName, image: cocktailImage });

        tx.oncomplete = function () {
            db.close();
        };
    };
    // Open the bookmarks page in a new tab
    window.open('../html/favorites.html', '_blank');
});

