/**
author Tyler Mulholland 
Student Number: 000287743 
Date: November 21st 2018 
Description: Assuignment 4 style page

I, Tyler Mulholland, student number 000287743, certify that all code submitted is my own work; that I have not copied it from any other source. I also certify that I have not allowed my work to be copied by others.

File description: This is the main avaScript file which handles the entire game for assignment 4 as well as DOM changes based on events.
**/

/* ---- KNOWN BUGS ---- 
* 1. Upon every run the create asteroid method will compound and
* steadily create more asteroids. 
* 2. On game over, asteroid canvas should be cleared but for some
* reason the asteroids still persist
* 3. Collision detection isn't great due to shape of asteroid. 
* Come up with better algorithm or redesign shape to be something 
* more square.
* 4. Sometimes the final game over message will not show up if the
* overall Hi Score is beaten. Couldn't figure out why.
* 5. When adding player to the hiScoreArray of new players if the
* score beats the last person on the list, sometimes it add the
* same person twice. Looking into this but there is no obvious
* reason as to why this would happen.
*/

/* ---- Ideas to Add ---- 
* 1. Different designs for asteroids, randomly selected on creation 
* 2. Opening form to get player name from user. Used for leaderB
* 3. Too many global variables, redestribute to limit if possible.
*/

/* ---- References ---- 
 * https://medium.freecodecamp.org/javascript-functions-af6f9186a553
 * https://www.geeksforgeeks.org/html5-game-development-infinitely-scrolling-background/
 * https://css-tricks.com/snippets/javascript/javascript-keycodes/
 * https://www.w3schools.com/js/js_object_definition.asp
 * https://javascript.info/class
 * http://www.phpied.com/3-ways-to-define-a-javascript-class/
 * https://stackoverflow.com/questions/8017541/javascript-canvas-collision-detection
 * https://www.w3schools.com/jsref/jsref_push.asp
 * https://www.w3schools.com/jsref/met_win_clearinterval.asp
 * https://www.w3schools.com/js/js_array_sort.asp
 * https://stackoverflow.com/questions/6307514/is-it-possible-to-override-javascripts-tostring-function-to-provide-meaningfu
 * */

/*-------------------------------------- GLOBAL VARIABLES ------------------------------------------------*/ 

// The canvases retrieved from the DOM Element //

/**
 * The element that will represent the background canvas.
 * @type Element
 */
var backgroundCanvas = document.getElementById("backgroundCanvas");

/**
 * The element that will represent the canvas for the Main Screen Ship.
 * @type Element
 */
var mainScreenShipCanvas = document.getElementById("mainScreenShipCanvas");

/**
 * The element that will represent the canvas for the main ingame ship.
 * @type Element
 */
var shipCanvas = document.getElementById("shipCanvas");

/**
 * The element that will represent the canvas for the asteroids.
 * @type Element
 */
var asteroidCanvas = document.getElementById("asteroidCanvas");

/**
 * The element that will represent the canvas for the score type elements.
 * @type Element
 */
var scoreCanvas = document.getElementById("scoreCanvas");

// Different graphics contexts which are used to draw. Similar to what we did in 
// Java for most graphics bases assignments.

/**
 * Graphics context for the background canvas
 * @type type
 */
var graphicsContextBG = backgroundCanvas.getContext("2d");

/**
 * Graphics context for the main screen ship canvas
 * @type type
 */
var graphicsContextMSS = mainScreenShipCanvas.getContext("2d");

/**
 * Graphics context for the in game ship canvas
 * @type type
 */
var graphicsContextShip = shipCanvas.getContext("2d");
 
/**
 * Graphics context for the asteroid canvas
 * @type type
 */
var graphicsContextAsteroid = asteroidCanvas.getContext("2d");

/**
 * Graphics context for the main screen ship canvas
 * @type type
 */
var graphicsContextScore = scoreCanvas.getContext("2d");

// Universal style rules for the score canvas
graphicsContextScore.fillStyle = "#B5FFF8";
graphicsContextScore.fontWeight = "bolder";
graphicsContextScore.textAlign = "center";

// Create the needed image objects and assign their respective src's

/**
 * Image for the background of the game
 * @type Image
 */
var background = new Image();
background.src = "resources/images/SpaceInvadersBackground.png";

/**
 * Image for the main screen ship (larger)
 * @type Image
 */
var mainScreenShip = new Image();
mainScreenShip.src = "resources/images/shipDefaultMM.png";

/**
 * Image for the in game ship
 * @type Image
 */
var gameShip = new Image();
gameShip.src = "resources/images/shipDefault.png";

/**
 * Image for the asteroid objects
 * @type Image
 */
var asteroidImage = new Image();
asteroidImage.src = "resources/images/asteroid.png"; 

// Global elements (button, text input, p) in the DOM which will be alters
// in some way (position, display, etc.)

/**
 * Element to represent the play button in the DOM
 * @type Element
 */
var playButton = document.querySelector(".playButton");

/**
 * Element to represent the leader board button in the DOM
 * @type Element
 */
var leaderButton = document.querySelector(".leaderButton");

/**
 * Element to represent the back button in the DOM
 * @type Element
 */
var backButton = document.querySelector(".backButton");

/**
 * Element to represent the text input box in the DOM
 * @type Element
 */
var playerNameBox = document.querySelector(".playerName");

/**
 * Element to represent the <p> error message in the DOM
 * @type Element
 */
var noNameErrorMessage = document.querySelector(".noNameErrorMessage");

/**
 * The array which will hold all of the top 10 Hi Score players.
 * Additional for loop which will populate with blank players so leaderboard will 
 * work even when there have been no previous players.
 * @type Array
 */
var hiScoreArray = new Array();
for (var i = 0; i < 10; i++) {
    hiScoreArray.push(new Player("AAA"));
}

/**
 * Will eventually carry a string taken from the player name text input box
 * @type Node.value|.document@call;querySelector.value|Element.value
 */
var playerName = null;

/**
 * Will eventuall contain a new player object with their name and final score
 * @type Player
 */
var currentPlayer = null;

// Variables which are checks that are used for the background loop and 
// game initializaion
var isGameStarted = false;
var isBackgroundRun = false;

/**
 * Player object (which is mainly used for scoring and leaderboards)
 * @param {type} playerName - Name of the player
 * @returns {Player}
 */
function Player(playerName) 
{
    this.name = playerName;
    this.asteroidsDodged = 0;
}

/**
 * Override the toString for the player object
 * Learned from:
 * https://stackoverflow.com/questions/6307514/is-it-possible-to-override-javascripts-tostring-function-to-provide-meaningfu
 * @returns {String}
 */
Player.prototype.toString = function() 
{
    return this.name + ": " + this.asteroidsDodged + " asteroid(s)";
};

/*-------------------------------------- EVENT LISTENERS ------------------------------------------------*/ 

/**
 * Assigns a method to occur when window is resized
 * @returns {undefined}
 */
window.onresize = menuPositioning;

/**
 * Assigns a method to occur when play button is clicked
 * @returns {undefined}
 */
playButton.onclick = startGame;

/**
 * Assigns a method to occur when leader board button is clicked
 * @returns {undefined}
 */
leaderButton.onclick = leaderBoards;

/**
 * Assigns a method to occur when back/restart button is clicked
 * @returns {undefined}
 */
backButton.onclick = restartGame;

/**
 * Event listener to capture any keyboard input (for ship movement)
 * @param Event - keyboard event 
 */
document.addEventListener("keydown", function(event) 
    {
        // Prevent default event can't go here because it will prevent 
        // keyboard input on the main screen (for entering player name)
        var keyPress = "";
        if (event.keyCode === 37) 
        {
            event.preventDefault(); // Needed to prevent the arrow keys from shifting the page
            keyPress = "left"; 
        } 
        else if (event.keyCode === 38)
        {
            event.preventDefault(); // Needed to prevent the arrow keys from shifting the page
            keyPress = "up";
        }
        else if (event.keyCode === 39)
        {
            event.preventDefault(); // Needed to prevent the arrow keys from shifting the page
            keyPress = "right";
        }
        else if (event.keyCode === 40) 
        {
            event.preventDefault(); // Needed to prevent the arrow keys from shifting the page
            keyPress = "down";
        }
    
        // Check to make sure the gaehas started, without this the ship would move in the menu.
        if (isGameStarted) 
        {
            playerShip.controller(keyPress);
        }
    }
 );

/*-------------------------------------- BASIC GAME FUNCTIONS ------------------------------------------------*/ 

/**
 * Method wich is used to initialize the game. Draws the background, main screen ship and calls
 * method to initialize the menu
 * @returns {undefined}
 */
function initializeGame() 
{
    // Although the two images are defined aboe as global, I found that upon reset and 
    // this function being called again the main screen ship would not load unless a new
    // image was created. Further investigation needed.
    var mainScreenShip = new Image();
    mainScreenShip.src = "resources/images/shipDefaultMM.png";
    
    // This segment is because the script would try to draw the background onto the canvas before it was loaded.
    // Half the time it would fail to draw, so with this it essentially waits until it is loaded and implements a function to draw it.
    background.onload = function() 
    {
        graphicsContextBG.drawImage(background, 0, 0);
    };

    mainScreenShip.onload = function() 
    {
        graphicsContextMSS.drawImage(mainScreenShip, ((mainScreenShipCanvas.width / 2) - (mainScreenShip.width / 2) - 7.5), (mainScreenShipCanvas.height / 3.5) - (mainScreenShip.height / 2));
    } ;
    
    initializeMenu();
}

/**
 * Method which initializes all of the menu elements (buttons, player name text box.
 * mainy used for making them viewable by changing their display style.
 * Also calls metod to position the menu
 * @returns {undefined}
 */
function initializeMenu() 
{
    playButton.style.position = "absolute";
    leaderButton.style.position = "absolute";
    playerNameBox.style.position = "absolute";
    playButton.style.display = "block";
    leaderButton.style.display = "block";
    playerNameBox.style.display = "block";
    backButton.style.display = "none";
    
    menuPositioning();
}

/**
 * Method called to position all menu elements (whether they are visible or not.
 * Uses the actual elements and canvases to position them in the appropriate places
 * @returns {undefined}
 */
function menuPositioning()
{
    playButton.style.left = backgroundCanvas.offsetLeft + ((backgroundCanvas.width / 2) - (playButton.offsetWidth / 2)) + "px";
    playButton.style.top = backgroundCanvas.offsetTop + (backgroundCanvas.height / 1.35) - (playButton.offsetHeight / 2) + "px";
    
    leaderButton.style.left = backgroundCanvas.offsetLeft + (backgroundCanvas.width / 2) - (leaderButton.offsetWidth / 2) + "px";
    leaderButton.style.top = backgroundCanvas.offsetTop + (backgroundCanvas.height / 1.15) - (leaderButton.offsetHeight / 2) + "px";
    
    backButton.style.left = backgroundCanvas.offsetLeft + (backgroundCanvas.width / 2) - (backButton.offsetWidth / 2) + "px";
    backButton.style.top = backgroundCanvas.offsetTop + (backgroundCanvas.height / 1.05) - (backButton.offsetHeight / 2) + "px";
    
    playerNameBox.style.left = backgroundCanvas.offsetLeft + (backgroundCanvas.width / 2) - (playerNameBox.offsetWidth / 2) + "px";
    playerNameBox.style.top = backgroundCanvas.offsetTop + (backgroundCanvas.height / 1.65) - (playerNameBox.offsetHeight / 2) + "px";
    
    noNameErrorMessage.style.left = backgroundCanvas.offsetLeft + (backgroundCanvas.width / 2) - (noNameErrorMessage.offsetWidth / 2) + "px";
    noNameErrorMessage.style.top = backgroundCanvas.offsetTop + (backgroundCanvas.height / 1.35) - (noNameErrorMessage.offsetHeight / 2) + "px";
}

/**
 * Method used to hide all menu elements by changing the display style
 * @returns {undefined}
 */
function hideMenu() 
{
    playButton.style.display = "none";
    leaderButton.style.display = "none";
    backButton.style.display = "none";  
    playerNameBox.style.display = "none"; 
}

/**
 * Method which displays the score in the top right side of the screen during gameplay
 * @returns {undefined}
 */
function displayScore() 
{
    var scoreDisplay = "Asteroids Dodged: " + currentPlayer.asteroidsDodged;
    graphicsContextScore.clearRect(0, 0, 1000, 600);
    graphicsContextScore.font = "25px Futura";
    graphicsContextScore.fillText(scoreDisplay, 860, 40);
}

/**
 * Method which takes the array of the top 10 player objects and generates 10 
 * strings with the toString methods to use in displaying all the scores.
 * @returns {undefined}
 */
function leaderBoards() 
{
    hideMenu();
    backButton.style.position = "absolute";
    backButton.style.display = "block";
    graphicsContextMSS.clearRect(0, 0, 1000, 600);
    graphicsContextScore.clearRect(0, 0, 1000, 600);
    graphicsContextScore.font = "40px Futura sans-serif";
    
    var firstHeight = 60;
    var incrementHeight = 0;
    
    for (var i = 0; i < 10; i++) 
    {
        var hiScoreText = hiScoreArray[i];
        graphicsContextScore.fillText(hiScoreText, (scoreCanvas.width / 2), firstHeight + incrementHeight);
        incrementHeight += 50;
    }
    menuPositioning();
}

/**
 * Method which alters the display of he error message. I chose to use a <p> element and 
 * alter its style instead of drawing on the canvas so it would match the style of the menu.
 * @returns {undefined}
 */
function displayNoNameError() 
{
    hideMenu();
    graphicsContextMSS.clearRect(0, 0, mainScreenShipCanvas.width, mainScreenShipCanvas.height);
    backButton.style.position = "absolute";
    backButton.style.display = "block";
    noNameErrorMessage.style.display = "block";
    noNameErrorMessage.style.position = "absolute";
    menuPositioning();
}

/**
 * Method called when the play button is pressed to start the game
 * @returns {undefined}
 */
function startGame() 
{
    // Get the player name from the text input box
    playerName = playerNameBox.value;
    
    // Confim the box isn't empty. If it is then display error and if not
    // then continue on with playing the game.
    if (playerName === "") 
    {
        displayNoNameError();
    }
    else 
    {
        currentPlayer = new Player(playerName); // create new Player object and assign to be the current player
        isBackgroundRun = true; // Confirm that the background should now be running 
        hideMenu();
        mainScreenShipZoomOff();
        backgroundLoop();
        setTimeout(gameShipZoomIn, 5500); // Start game ship zoom in in 5.5 seconds
        setTimeout(displayScore, 5500); // Display score in 5.5 seconds
    }
}

/**
 * Method called to end the game once one of the asteroid object come in contact with 
 * the player's ship.
 * @returns {undefined}
 */
function gameOver() 
{   
    hiScoreCheck(); // Check if the current players score should be in the hiScore array
    
    isGameStarted = false;
    isBackgroundRun = false;
    
    // When called when isGameStarted is false the method should 
    // theoretically clear the interval for creating asteroids.
    initializeAsteroids();
    
    playerShip.x = (shipCanvas.width / 2) - (gameShip.width/2);
    playerShip.y = shipCanvas.height;
    
    backButton.style.position = "absolute";
    backButton.style.display = "block";
    
    var gameOverDisplay = "GAME OVER" ;
    var finalScore = "You Dodged " + currentPlayer.asteroidsDodged + " asteroids!";
    graphicsContextScore.clearRect(0, 0, 1000, 600);
    graphicsContextScore.textAlign = "center";
    graphicsContextScore.font = "90px Futura sans-serif";
    graphicsContextScore.fillText(gameOverDisplay, (scoreCanvas.width / 2), (scoreCanvas.height / 3));
    graphicsContextScore.font = "70px Futura sans-serif";
    graphicsContextScore.fillText(finalScore, (scoreCanvas.width / 2), (scoreCanvas.height / 2));
    
    graphicsContextShip.clearRect(0, 0, 1000, 600);
    graphicsContextAsteroid.clearRect(0, 0, 1000, 600);
    
    menuPositioning();
}

/**
 * Method o check if the current player's score should replace another 
 * hi score player in the hiScore array.
 * @returns {undefined}
 */
function hiScoreCheck() 
{
    if (currentPlayer.asteroidsDodged > hiScoreArray[9].asteroidsDodged || hiScoreArray[9].name === "AAA");
    {
        hiScoreArray[9] = currentPlayer;
    }
    
    // Normal sort does not work on numeric values as it defaults
    // to sorting string values. Obtained this sorting method from
    // https://www.w3schools.com/js/js_array_sort.asp
    hiScoreArray.sort(function(a,b) {return b.asteroidsDodged - a.asteroidsDodged;});
}

/**
 * Method used to restart the game, clears all the relevant canvases and initliazed the 
 * game again. Used when back button is pressed
 * @returns {undefined}
 */
function restartGame() 
{   
    graphicsContextScore.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    graphicsContextBG.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    graphicsContextMSS.clearRect(0, 0, mainScreenShipCanvas.width, mainScreenShipCanvas.height);
    graphicsContextAsteroid.clearRect(0, 0, asteroidCanvas.width, asteroidCanvas.height);
    noNameErrorMessage.style.display = "none";
    
    graphicsContextBG.drawImage(background, 0, 0);
    
    initializeGame();
}

/**
 * Method which handles the scrolling background. Check references comment on top for 
 * more information on how I learned to do this.
 * @returns {undefined}
 */
function backgroundLoop() 
{
    var imgHeight = 0; 
    var scrollSpeed = 1; 
    
    /**
     * Loop which continually clears and redraws backgrounds so make the appearance
     * of the background scrolling 
     * @returns {undefined}
     */
    function loop()
    {
        graphicsContextBG.drawImage(background, 0, imgHeight); 
        graphicsContextBG.drawImage(background, 0, imgHeight - backgroundCanvas.height);
        graphicsContextBG.drawImage(background, 0, imgHeight); 
        graphicsContextBG.drawImage(background, 0, imgHeight - backgroundCanvas.height - backgroundCanvas.height);
        imgHeight += scrollSpeed;
        if (imgHeight === backgroundCanvas.height);
        {
            imgHeight = 0; 
        }
        
        if (isBackgroundRun) 
        {
            window.requestAnimationFrame(loop);
        }
    }
       loop();   
}

/**
 * Method which makes it appear as though the ship on he main screen zooms off.
 * Used same mehod as the scrolling background but inverted the direction.
 * @returns {undefined}
 */
function mainScreenShipZoomOff() 
{
    var imgHeight = 0;
    var scrollSpeed = 1.5;  
    
    /**
     * Loop which continually clears and redraws Main Menu Ship
     * @returns {undefined}
     */
    function loop()
    {
        graphicsContextMSS.clearRect(0, 0, mainScreenShipCanvas.width, mainScreenShipCanvas.height);
        graphicsContextMSS.drawImage(mainScreenShip, ((mainScreenShipCanvas.width / 2) - (mainScreenShip.width / 2) - 7.5), ((mainScreenShipCanvas.height / 3.5) - (mainScreenShip.height / 2)) - imgHeight);
        
        imgHeight += scrollSpeed; 
        if (imgHeight >= (mainScreenShipCanvas.height / 3.5) - (mainScreenShip.height / 2) + mainScreenShip.height) 
        {
            imgHeight = 0; 
            return;
        }
        
        window.requestAnimationFrame(loop);     
    }
    loop(); 
}

/**
 * Method which animates the main game ship, making it appear as though 
 * is come from the bottom of he screen. Also a copy of background scroll.
 * @returns {undefined}
 */
function gameShipZoomIn() 
{
    var scrollSpeed = 1.5;  
    
    /**
     * Loop which continually clears and redraws in game ship
     * @returns {undefined}
     */
    function loop()
    {
        playerShip.drawShip();
        playerShip.y -= scrollSpeed;
        
        if (playerShip.y <= 450) 
        {
            return; 
        }
        
       window.requestAnimationFrame(loop);        
    }
    loop();
    setTimeout(initializeAsteroids, 5000); // Once the loop is started, call for the initialization of asteroids after 5 seconds
    isGameStarted = true; // Mark the game as started so the keyboard input will start working 
}

/**
 * Single object definition for the Player's Ship. Check references for more information on how I learned this.
 * I figured since there will only ever be one player ship i could define a single object instead of making it so 
 * you can instantiate them as needed. 
 * @type  (playerShip)
 */
var playerShip = 
{
    // Instance variables for ship object
    x : (shipCanvas.width / 2) - (gameShip.width/2), // Starts in the middle of canvas
    y : shipCanvas.height, // Starts at he bottom of canvas
    shipSpeed : 10, // Moves by 10 pixels at a time. Adjust to change difficulty
    
    /**
     * Function which will be called to draw the ship on any given position based on its x and y
     * @returns {undefined}
     */
    drawShip : function() 
    {
        graphicsContextShip.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
        graphicsContextShip.drawImage(gameShip, this.x, this.y);
    },
    
    /**
     * Controller which is called by the keypress event listener. 
     * Alters ship's x and y based on what key was pressed
     * @param {type} keyPress - String representation of the keycode which was pressed
     * @returns {undefined}
     */
    controller : function(keyPress) 
    {
        if (keyPress === "left" && this.x > 0)
        {
            this.x -= this.shipSpeed;
        }
        
        if (keyPress === "right" && (this.x < (shipCanvas.width - 75)))
        {
            this.x += this.shipSpeed;
        }
        
        if (keyPress === "up" && (this.y > 0) )
        {
            this.y -= this.shipSpeed;
        }
        
        if (keyPress === "down" && (this.y < shipCanvas.height - 65))
        {
            this.y += this.shipSpeed;
        }
        
        try
        {
            window.requestAnimationFrame(this.drawShip());
        }catch (TypeError) {
            // Im not sure why there is a function type error since 
            // drawship is a function and this does seem to
            // be working. 
        }
    }  
};

/**
 * Method called once its appropriate for the asteroids to start spawning.
 * @returns {undefined}
 */
function initializeAsteroids() 
{
    // Game currently has a bug which the createAsteroid is called far too
    // too much on each subsequent playthrough. Attempted to use this to 
    // clear the interval and remedy the problem but it doesnt appear to have 
    // worked. Still a good learning experience. Explaination in references.
    if (isGameStarted) 
    {
        var asteroidGen = setInterval(createAsteroid, 900);
    }
    else 
    {
        clearInterval(asteroidGen); 
        return;
    }
        
}

/**
 * Function which is called whenever an asteroid needs to be created.
 * Generated a random number to influence the size. 
 * @returns {undefined}
 */
function createAsteroid()
{
    var randomScale = Math.random() * 2.5 + 0.5;
    
    if (isGameStarted) 
    {
        new Asteroid(randomScale);
    }
    else 
    {
        return;
    }
}

/**
 * Class for Asteroid objects. Again since we havent technically learned this, please
 * refer to my references at the top of the page which detail how exactly I learned this.
 * Very similar to other languages, the only catch that proved to be a problem was when
 * altering instance variables from within methods in the class you hae to create a seperate
 * instance variable to represent "this" then call to alter the "parent" in those child methods.
 * @param {type} randomScale
 * @returns {Asteroid}
 */
function Asteroid(randomScale) 
{
    var asteroidSpeed = 5.5;

    this.tempWidth = (100 * randomScale);
    this.tempHeight = (100 * randomScale);
    
    this.x = Math.random() * ((asteroidCanvas.width + this.tempWidth - 10) - (10 - this.tempWidth)) + (10 - this.tempWidth);
    this.y = 0 - this.tempHeight;
    
    this.isAlive = true;
    
    var parent = this;
    
    /**
     * Function which will be called to draw the asteroid on any given position based on its x and y
     * @returns {undefined}
     */
    function drawAsteroid()
    {
        graphicsContextAsteroid.clearRect(parent.x, parent.y - asteroidSpeed, parent.tempWidth, parent.tempHeight);
        graphicsContextAsteroid.drawImage(asteroidImage, parent.x, parent.y, parent.tempWidth, parent.tempHeight);
    }
    
    /**
     * Loop similar to the background scrolling loop which lets each asteroid object move across the screen
     * on each loop (frame) there is a check if he asteroid made it to the bottom of the canvas. If passed that is 
     * added to the current players score. Each loop also calls the check collision method (passing the 
     * this/parent object to do the check). 
     * @returns {undefined}
     */
    function moveAsteroid()
    {
        drawAsteroid();
        parent.y += asteroidSpeed;
        
        if (parent.y > asteroidCanvas.height) 
        {
            parent.isAlive = false;
            graphicsContextAsteroid.clearRect(parent.x, parent.y - 6, parent.tempWidth, parent.tempHeight);
            currentPlayer.asteroidsDodged += 1;
            displayScore();
            return; 
        }
        
        if (isGameStarted && parent.isAlive) 
        {
            window.requestAnimationFrame(moveAsteroid);
        }
        
        if(checkCollision(parent))
        {
            gameOver();
        }    
    }
    moveAsteroid();
}

/**
 * Method wich checks if there is a collision. Currently very glitchy. The algorithm used was found online
 * and altered slightly. Check references at top for more information.
 * @param {type} asteroidObj - the specific aseroid object which called the method to check for a collision
 * @returns {Boolean}
 */
function checkCollision(asteroidObj) 
{
    
    var shipX = playerShip.x, shipY = playerShip.y, shipW = gameShip.width, shipH = gameShip.height;
    var asteroidX = asteroidObj.x, asteroidY = asteroidObj.y, asteroidW = asteroidObj.tempWidth - ( 1.5 * (asteroidObj.tempWidth / 1000)), asteroidH = asteroidObj.tempHeight - (1.5 * (asteroidObj.tempHeight / 1000));
    
    asteroidW += asteroidX;
    shipW += shipX;
    if (asteroidX > shipW || shipX > asteroidW)
    {
        return false;
    }
    
    asteroidH += asteroidY;
    shipH += shipY;
    if (asteroidY > shipH || shipY > asteroidH) 
    {
        return false;
    }
    return true;
    
    
}

/*eslint-env browser*/
/*exported backgroundLoop,initializeGame,initializeMenu,startGame,leaderBoards,screenResize*/