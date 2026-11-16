$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to load all stats of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.rest-button').click(clickedRestButton);
    $('.reset-button').click(clickedResetButton);
    
  });
  
    // Pet’s stats: name, weight, happiness, evolution stage (1–3), and energy (0–100)
    var pet_info = {name: "Spheal", weight: 87, happiness: 5, stage: 1, energy: 100};
    // Names, images, and weights for each evolution, in order
    var evolutionLine = ["Spheal", "Sealeo", "Walrein"];
    var evolutionImage = ["images/Spheal.png", "images/Sealeo.png", "images/Walrein.png"];
    var evolutionWeight = [87, 193, 332];
    // Tracks whether Start Over was clicked once and is waiting for a confirm click
    var resetPending = false;
    var resetTimer;

    // Checks if the pet is happy enough to evolve
    function checkEvolution() {
      // Stage 1 evolves into stage 2 once happiness reaches 50
      if (pet_info.stage === 1 && pet_info.happiness >= 50) {
        pet_info.stage = 2;
        petSays(pet_info.name + ' has evolved into ' + evolutionLine[1] + '!');
        pet_info.weight = evolutionWeight[1];
        // .fadeTo(speed, opacity, callback) fades an element to a set opacity (0 = invisible, 1 = visible)
        // The function inside runs after the fade is done so the picture swaps while it is invisible
        $('.pet-image').fadeTo(600, 0, function() {
          // .prop(property, value) sets a property on an element and here it changes the image's src to the next evolution picture from the evolutionImage array
          $('.pet-image').prop('src', evolutionImage[1]);
          // Fade the new image back in to full opacity
          $('.pet-image').fadeTo(600, 1);
        });
      }
      // Stage 2 evolves into stage 3 once happiness reaches 100
      else if (pet_info.stage === 2 && pet_info.happiness >= 100) {
        pet_info.stage = 3;
        petSays(pet_info.name + ' has evolved into ' + evolutionLine[2] + '!');
        pet_info.weight = evolutionWeight[2];
        // Same fade and image swap as above, but for Walrein
        $('.pet-image').fadeTo(600, 0, function() {
          $('.pet-image').prop('src', evolutionImage[2]);
          $('.pet-image').fadeTo(600, 1);
        });
      }
      // Set the name to match the current stage (stage 1 = index 0, etc.)
      pet_info.name = evolutionLine[pet_info.stage - 1];
    }
  
    function clickedTreatButton() {
      // Increase pet happiness
      pet_info.happiness += 3;
      // Increase pet weight
      pet_info.weight += 3;
      // Increase pet energy
      pet_info.energy += 10;
      // reaction to getting a treat
      petSays(pet_info.name + ' is munching!');
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedPlayButton() {
      // If not enough energy to play, refuse and stop here       
      if (pet_info.energy < 10) {                  
        petSays(pet_info.name + ' is too tired to play...');
        return;
      }
      // Increase pet happiness
      pet_info.happiness += 3;
      // Decrease pet weight
      pet_info.weight -= 2;
      // Decrease pet energy
      pet_info.energy -= 10;
      // reaction to playing
      petSays(pet_info.name + ' is playing!');
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedExerciseButton() {
      // If not enough energy to exercise, refuse and stop here
      if (pet_info.energy < 20) {
        petSays(pet_info.name + ' is too tired to exercise...');
        return;
      }
      // Decrease pet happiness
      pet_info.happiness -= 2;
      // Decrease pet weight
      pet_info.weight -= 5;
      // Decrease pet energy
      pet_info.energy -= 20;
      // reaction to exercising
      petSays(pet_info.name + ' is exercising!');
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedRestButton() {
      // Increase pet energy
      pet_info.energy += 100;
      // reaction to resting
      petSays(pet_info.name + ' is resting!');
      checkAndUpdatePetInfoInHtml();
    }

    // Shows a message in the speech bubble and makes it blink so every click is visible even if the message is the same
    function petSays(message) {
      $('.pet-comment').text(message);
      // .fadeTo() quickly dims the bubble to 30% opacity then back to 100%
      $('.pet-comment').fadeTo(100, 0.3);
      $('.pet-comment').fadeTo(100, 1);
    }
  
    // Fixes invalid stats, checks evolution, then updates the page
    function checkAndUpdatePetInfoInHtml() {
      checkStatsBeforeUpdating();
      checkEvolution();
      updatePetInfoInHtml();
    }
    
    // Keeps stats within their allowed range
    function checkStatsBeforeUpdating() {
      // Keeps weight and happiness from going below zero
      if (pet_info.weight < 0) {
        pet_info.weight = 0;
      }
      if (pet_info.happiness < 0) {
        pet_info.happiness = 0;
      }
      // Keeps energy from going below zero
      if (pet_info.energy < 0) {
        pet_info.energy = 0;
      }
      // Keeps energy from going above 100
      if (pet_info.energy > 100) {
        pet_info.energy = 100;
      }
    }
    
    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info['name']);
      $('.weight').text(pet_info['weight']);
      $('.happiness').text(pet_info['happiness']);
      $('.stage').text(pet_info['stage']);
      $('.energy').text(pet_info['energy']);
    }

    // Starts the game over with a brand new Spheal (asks for a second click first)
    function clickedResetButton() {
      // First click: ask to confirm instead of resetting right away
      if (resetPending === false) {
        resetPending = true;
        $('.reset-button').text('Are you sure? Click again');
        // If there's no second click within 3 seconds, cancel and go back to normal
        resetTimer = setTimeout(function() {
          resetPending = false;
          $('.reset-button').text('Start Over');
        }, 3000);
        return;
      }

      // Second click: cancel the countdown and actually reset
      clearTimeout(resetTimer);
      resetPending = false;
      $('.reset-button').text('Start Over');

      // Put all stats back to the same starting values as pet_info at the top
      pet_info = {name: "Spheal", weight: 87, happiness: 5, stage: 1, energy: 100};
      // Uses .prop() again to switch the picture back to Spheal
      $('.pet-image').prop('src', evolutionImage[0]);
      petSays('A new Spheal appeared!');
      checkAndUpdatePetInfoInHtml();
    }
  