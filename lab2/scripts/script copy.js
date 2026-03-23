console.log("runnin");

let correctNumber  = 9;
let correctMessage = "Congrats";
let wrongMessage = "Wrong";
let attempts = 7;
let guessattempts =0;
let highMessage = "toHigh";
let lowMessage = "toLow";



let guessInput = document.querySelector("#guessInput");
let guessButton = document.querySelector("#guessButton");
let guessResult = document.querySelector("#guessResult");
let highlow = document.querySelector("#highlow");
let incorrect= document.querySelector("#incorrect");



guessButton.addEventListener("click",function(){
    
    if(correctNumber==guessInput.value & attempts> guessattempts ){
        guessResult.textContent = correctMessage;
        guessResult.style.color = 'green';    
        
    }else{

        guessattempts = guessattempts + 1;
        guessResult.style.color = 'red';
        if (guessInput > correctNumber){
            highlow.textContent = "too high";
        }else{
            highlow.textContent = "too low";
        }

    }
} );