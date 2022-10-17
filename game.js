let numberOfCards = 48;
let images_array = [];
let cards_array = [];
let playerName = "";
let numCardsOpened = 0;
let cardsOpened = [];
let currentScoreCounter = 0;
let totalAtemptCounter = 0;
let currentPlayerScore = 0;
let gameStarted = false;
let gameFinished = false;


const setImportantVariables = function (){      // set the variables which give info about the state of the game
    if($(".hide").length == 1){         // game Just Started
        gameStarted = true;
        gameFinished = false;
        currentScoreCounter = 0;
        totalAtemptCounter = 0;
        currentPlayerScore = 0;
    }

    else if($(".hide").length == numberOfCards){    //game Just finished
        gameFinished = true;
        gameStarted=false;
        currentPlayerScore = parseFloat(((currentScoreCounter/totalAtemptCounter)*100).toFixed(2));
        
        //saving current players score in local storage
        if(playerName && ((localStorage[playerName]<currentPlayerScore)|| !localStorage[playerName])){
            localStorage[playerName] = currentPlayerScore;
        }

        loadPlayerAttributes();
        if(currentPlayerScore){
            $("#correct").text(" Correct: "+currentPlayerScore);  // displaying the highscore
        }
        
    }
}

const preloadImages = () =>{
    
    let image1 = new Image();
    image1.src = "images/back.png";
    let image2 = new Image();
    image2.src = "images/blank.png";

    for(let i=1;i<=24;i++){
        images_array[i-1] = new Image();
        images_array[i-1].src = "images/card_"+i+".png";
        cards_array[i-1] = images_array[i-1].src;
    }

    console.log("preload done");

}



const saveSettingsClicked = () => { // click handler for save_settings button
    // saves playerName and number of cards into the session storage
    console.log("save clicked")
    playerName = $("#player_name").val();
    numberOfCards = $("#num_cards").val();

    sessionStorage.setItem("playerName",playerName);
    sessionStorage.setItem("numberOfCards",numberOfCards);

    location.reload(true);
}

const loadPlayerAttributes = () =>  {

    playerName = sessionStorage.getItem("playerName"); // getting player name from session storage
    if(playerName){
        $("#player").text(" Player: "+playerName);  // displaying the player name

        if(localStorage.getItem(playerName)){
            $("#high_score").text(" High Score: "+localStorage.getItem(playerName));  // displaying the highscore
        }

    }

    numberOfCards = (sessionStorage.getItem("numberOfCards"))?sessionStorage.getItem("numberOfCards"):numberOfCards;        //if its a new session,set numberOfCards to default value 48
        
    
}

function shuffleArray(array) {      // shuffles any array and returns it
    for (let i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));
                    
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
}

const generateShuffledArray = () => {       // generates an array based on the number of cards
    
    let myarr = []
    for(let i = 0;i<numberOfCards;i++){
        myarr[i] = (i %(numberOfCards/2))+1; 
    }
    myarr = shuffleArray(myarr);
    console.log(myarr);
    console.log(numberOfCards);

    return myarr;
}

const displayCards = (shuffledIndexArray) =>{   // displays the correct number of cards when the user starts the game
    console.log("displaying cards...");
    let rows = numberOfCards/8 ;
    // console.log("numberOf cards = ",numberOfCards);
    // console.log("rows = ",rows);
    let index = 0;
    for (let i = 0; i<rows; i++){
        let cardRow = "<div>";
        console.log("i = ",i);
        for(let j = 0;j<8;j++){
            cardRow += "<a id ='images/card_"+shuffledIndexArray[index]+".png' href='#'><img src='images/back.png' alt=''></a>" ;
            index++;
        }
        cardRow += "</div>";
        // console.log("cardRow = ",cardRow)
        $("#cards").append(cardRow);
    }

    
    
}

const disableClickForAllCards = function(){ // disables click event listeners for the cards
    $('#cards a').off('click');
}

const enableClickForAllCards = function(){  // disables enables click event listeners for the cards
    $('#cards a').on('click',cardClicked);
}

const cardClicked = () =>{
    disableClickForAllCards();              //disabling it to avoid double click events from calling click twice
    setTimeout(()=>{
        enableClickForAllCards();           //re-enabling click after half a second 
    },500)
    if($(event.target).attr('src')=="images/back.png"){ //to ensure only an unopened card is clicked

        console.log("card was clicked",event.target);
        numCardsOpened++;
        console.log("numCardsOpened",numCardsOpened);
        setImportantVariables();
        if(numCardsOpened<=2){

            let imageSrc = $(event.target).parent().attr('id'); 
            console.log("actual src of image clicked", imageSrc) ;   //getting the source of the image to be shown from the id of the parent 
            let imageClicked = $(event.target);
            imageClicked.fadeOut(500,function(){
                imageClicked.attr('src',imageSrc);
                console.log("changing src attribute for picture",imageSrc);
                if(numCardsOpened === 2){
                    totalAtemptCounter++;
                    disableClickForAllCards();                  //ensures that user does not click more cards after opening 2 cards (until the animation gets over)
                    let src1 = cardsOpened[0].attr('src');          // src of first image clicked
                    let src2 = cardsOpened[1].attr('src');          // src of second image clicked
                    console.log("cardsOpened src1 = ",src1);
                    console.log("cardsOpened src2 = ",src2);
                    if(src1 == src2){
                        console.log("same cards");
                        //adding score here
                        currentScoreCounter++;

                        cardsOpened[0].delay(1000).slideUp({duration:500,start: ()=>{
                            console.log("card0 slide starts ");
                            cardsOpened[1].delay(1000).slideUp({duration:500,queue:false,complete: function(){
            
                                cardsOpened[1].addClass('hide');
                                cardsOpened[1].show();
                                
                                console.log("card1 slide done ");
            
                            }});
                        },complete:()=>{
                            cardsOpened[0].addClass('hide');
                            cardsOpened[0].show();
                            cardsOpened.length = 0;              //emptying the array that holds the cards which are opened
                            console.log("card0 slide done ");
                            setImportantVariables();
                            enableClickForAllCards();           // re-enables the user to click the cards again 
            
                        }});

                        
                    }
                    else{
                        console.log('not same cards');
            
                        // cardsOpened[0].delay(2000).fadeOut(500,function(){
                        //     cardsOpened[0].attr('src',"images/back.png");
                        // }).fadeIn(500);
                        // cardsOpened[1].delay(2000).fadeOut(500,function(){
                        //     cardsOpened[1].attr('src',"images/back.png");
                        //     cardsOpened.length = 0;             //emptying the array that holds the cards which are opened
                        //     enableClickForAllCards();           // re-enables the user to click the cards again 
                        //     setImportantVariables();
                        // }).fadeIn(500);

                        cardsOpened[0].delay(2000).fadeOut({duration:500, complete:()=>{
                            cardsOpened[0].attr('src',"images/back.png");
                            cardsOpened[1].show();
                            cardsOpened.length = 0;  //emptying the array that holds the cards which are opened
                            enableClickForAllCards();              // re-enables the user to click the cards again 
                            setImportantVariables();
                        },start:()=>{
                            cardsOpened[1].delay(2000).fadeOut({duration:500,queue:false, complete:()=>{
                                cardsOpened[1].attr('src',"images/back.png");
                                cardsOpened[1].show();
                                // cardsOpened.length = 0;  //emptying the array that holds the cards which are opened
                            }}).fadeIn(500);
                        }}).fadeIn(500);
                        
                    }
                    numCardsOpened = 0;             //setting the number of cards opened to 0;
                    // cardsOpened.length = 0;         //emptying the array that holds the cards which are opened
                }
            }).fadeIn(500);

            cardsOpened[cardsOpened.length] = imageClicked;
            
        }
    
    
    }
}


$( document ).ready(function() {

    console.log("hello from game.js");

    $( "#tabs" ).tabs();    // using jquery tabs 
    
    loadPlayerAttributes();
    // //preloading images
    preloadImages();

    $("#save_settings").click(saveSettingsClicked);

    let shuffledIndexArray = generateShuffledArray();

    displayCards(shuffledIndexArray);
    

    //setting clicklisteners for the cards being displayed 
    enableClickForAllCards();
    
    


});



