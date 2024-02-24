// Local Storage of Dynamically Added Recepies...
document.addEventListener('DOMContentLoaded', function() {
    const storedRecipes = JSON.parse(localStorage.getItem('newrecipe'));
    if (storedRecipes) {
        const mainDiv = document.getElementById('mainContent');
        storedRecipes.forEach(recipe => {
            mainDiv.innerHTML += recipe.recipeHTML;
        });
    }
});


// Local Storage of Alreday Added Recepies... (In HTML)
document.addEventListener('DOMContentLoaded' , ()=>{

    const storedrecipe = localStorage.getItem('myRecipeName');
    // console.log(storedrecipe)

    const storedingredient = localStorage.getItem('myIngredients');
    // console.log(storedingredient)
    
    if(storedrecipe){
        const recipeNameDiv = document.querySelector('.recipeName')
        recipeNameDiv.textContent = storedrecipe;
    }
    if(storedingredient){
        const ingredientDiv = document.querySelector('.ingredeints')
        ingredientDiv.innerHTML = storedingredient;
    }
})

// Edit Recipe Buttton
document.getElementById('mainContent').addEventListener('click', function(event) {
    const editButton = event.target.closest('#editRecipe');
    if (editButton) {
        const recipeDiv = document.querySelector('.recipe');
        editRecipe(recipeDiv);
    }
});

/* NOTE => This event delegation approach allows you to attach a single event listener to a parent container instead of attaching individual event listeners to each edit button.  */

function editRecipe(recipeDiv, recipeID){

    const details = recipeDiv.children[1]

    const recipeNameDiv = details.children[0]
    const ingredientDiv = details.children[1];

    //After Editing
    let newRecipeName = prompt('Enter Recipe Name:');
    let newIngredients = prompt('Enter Ingredients');

    // Displaying on Page (Changing the text on the page)
    if(newRecipeName){
        recipeNameDiv.textContent = newRecipeName
    }
    if(newIngredients){
        ingredientDiv.innerHTML = newIngredients
    }

    recipeName = recipeNameDiv.textContent;
    ingredeints = ingredientDiv.innerHTML;

    // console.log(recipeName)
    // console.log(ingredeints)

    //Storing Edited Recipe In Local Storage only if it belongs to original ID (HTML Recipe)
    const id = recipeDiv.id;
    if(id == 'Original'){
        if(newRecipeName){
            localStorage.setItem('myRecipeName', newRecipeName);
        }
        if(newIngredients){
            localStorage.setItem('myIngredients', newIngredients);
        }
    }


    //Local Storage of Edit Button of Dynamically Added Recipe

    // console.log(recipeDiv.parentElement.children[1])
    const editedName = details.children[0].textContent
    const editedIngredients = details.children[1].textContent

    // console.log(editedName)
    // console.log(editedIngredients)

    // Function to save the changes in Local Storage
    SaveChanges(editedName,editedIngredients,recipeID);
}

let recipeArray = [];

// FORM Script...

// (Add New Recipe) Button
const addNewRecipeButton = document.querySelector('.addNewRecipe')
const closeBtn = document.querySelector('.closeBtn')

addNewRecipeButton.addEventListener('click' , ()=>{
    // console.log(document.querySelector('.popup'))
    document.querySelector('.popup').classList.add('transition');
})
closeBtn.addEventListener('click' , ()=>{
    document.querySelector('.popup').classList.remove('transition');
})

// Form Handling
const addRecipeForm = document.querySelector('#addRecipeForm')

addRecipeForm.addEventListener('submit',(event)=>{
    event.preventDefault(); // Prevent default form submission behavior

    const recipeNameElement = document.getElementById('recipeName').value
    const ingredientElemnet = document.getElementById('ingredients').value
    const recipeImage = document.getElementById('recipeImage').files[0]

    const imageURL = URL.createObjectURL(recipeImage);

    //unique ID for each newly added recipe
    const recipeId = 'recipe_' + Math.random();
  

    const recipeHTML = `
    <div class="recipe" id="${recipeId}">
        <img class="newImage" id="image" src="${imageURL}" style="width: 300px; height: 230px;"/>
        <div class="detail">
            <div class="recipeName">${recipeNameElement}</div>
            <div class="ingredeints">${ingredientElemnet}</div>
        </div>
        <button class="editRecipeButton" id="newEditButton">Edit Recipe</button>
    </div>
    `;

    const mainDiv = document.getElementById('mainContent');

    mainDiv.innerHTML += recipeHTML;    // Append the New Recipe to mainDiv 
    addRecipeForm.reset();      // Reset the From
    document.querySelector('.popup').classList.remove('transition'); // Remove the Form from the page after Submitting the recipe 


    // Create the object for each recipe
     const recipeObj = {
        recipeHTML : recipeHTML,
        recipe: recipeNameElement,
        ingredients: ingredientElemnet,
        image: imageURL,
        recipeId : recipeId
    }
    // Save the newly added recipe in Local Storage {L:165}
    saveNewRecipe(recipeObj);

    const storedRecipeInLocal = JSON.parse(localStorage.getItem('newrecipe'));
    console.log(storedRecipeInLocal)
})


// Save Newly Added Recipe to Local Storage 
let recipes = JSON.parse(localStorage.getItem('newrecipe')) || [];
function saveNewRecipe(recipeObj){
    recipes.push(recipeObj);
    localStorage.setItem('newrecipe', JSON.stringify(recipes));
    // console.log(recipe);
}

// Edit Button (Dynamically Added Recepies)
document.getElementById('mainContent').addEventListener('click', function(event){
    const button = event.target.closest('#newEditButton');
    if(button){
        const recipeDiv = button.parentElement;
        const ID = recipeDiv.id;
        editRecipe(recipeDiv,ID);
    }
})

// Edited Button Changes Saved in Local Storage for Newly Added Recipe
function SaveChanges(newRecipeName , newIngredients, recipeID){
    // console.log(recipes)

    recipes.forEach((recipe)=>{

        // Check for the index of the array so that the changes should be only daved on that particular recipe (Take help of unique ID fot this)
        if(recipe.recipeId == recipeID){
            // console.log(`Old Recipe Name : ${recipe.recipe} => New Recipe Name: ${newRecipeName}`)
            // console.log(`Old ingredients Name : ${recipe.ingredients} => New ingredients Name: ${newIngredients}`)

            let objectIndexOfRecipe = recipes.findIndex(recipe => recipe.recipeId == recipeID);
            
            // console.log(recipes[objectIndexOfRecipe].recipe)
            if(objectIndexOfRecipe !== -1){
                
                recipes[objectIndexOfRecipe].recipe = newRecipeName; //Update the Name
                
                recipes[objectIndexOfRecipe].ingredients = newIngredients; // Update the Ingredients
                /* We have Updated the Recipe Array with the New Values */
                
                const newRecipe = JSON.stringify(recipes)
                // console.log(newRecipe)
                localStorage.setItem('newrecipe' , newRecipe)  // We are Storing the newRecipe Array (New Array after Updating value) in the Local Storage

                const recipeimage = recipes[objectIndexOfRecipe].image

                // Generate New HTML for the Recipe so that we can Actually Display it to the user
                const newHTML = generateNewRecipeHTML(newRecipeName , newIngredients, recipeID, recipeimage)

                // console.log(`New HTML ; ${newHTML}`)
                // console.log(`OLD HTML ; ${recipes[objectIndexOfRecipe].recipeHTML}`)

                recipes[objectIndexOfRecipe].recipeHTML = newHTML; // Put this new HTML in the previous HTML of the recipe at that index
                
                localStorage.setItem('newrecipe', JSON.stringify(recipes)); // Save the Changes of the recieHTML property to the local storage 
            }
        }
    }); 
}

function generateNewRecipeHTML(name , ingredeints, ID, image){
    return `
    <div class="recipe" id="${ID}">
        <img class="newImage" id="image" src="${image}" style="width: 300px; height: 230px;"/>
        <div class="detail">
            <div class="recipeName">${name}</div>
            <div class="ingredeints">${ingredeints}</div>
        </div>
        <button class="editRecipeButton" id="newEditButton">Edit Recipe</button>
    </div>
    `
}

// Clear All Added Recipes Button 
document.querySelector('#clearStorage').addEventListener('click' , ()=>{
    localStorage.clear();
})