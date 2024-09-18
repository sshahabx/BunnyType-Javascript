const words = "In a world where creativity and innovation intertwine its crucial to embrace the unknown with enthusiasm The journey through uncharted territories often reveals unexpected opportunities and challenges As we navigate through complex algorithms and diverse scenarios its essential to remain adaptable and resourceful Success isn't solely about reaching a destination but also about the resilience and growth experienced along the way By harmonizing our efforts and staying curious we transform obstacles into stepping stones making every endeavor a worth while pursuit".split(' ');
const wordsCount = words.length;
const gameTime=3*1000;
window.timer=null;
window.gameStart=null;

function addClass(el,name){
    el.className +=' '+name;
}

function removeClass(el,name){
    el.className=el.className.replace(name, '');
}


function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordsCount); // Use Math.floor instead of Math.ceil
    return words[randomIndex];
}


function formatWord(word) {
    return `<div class="word">${
        word.split('').map(letter => `<span class="letter">${letter}</span>`).join('')
    }</div>`;
}

function newGame() {
    const wordsContainer = document.getElementById("words");
    wordsContainer.innerHTML = ''; // Clear the container
    for (let i = 0; i < 200; i++) {
        wordsContainer.innerHTML += formatWord(randomWord());
    }
    
    addClass(document.querySelector(".word"), 'current');
    addClass(document.querySelector(".letter"), 'current');
    document.getElementById("info").innerHTML=(gameTime/1000)+'';
    window.timer=null;
}

function wordsWpm(){
    const words=[...document.querySelectorAll(".word")];
    const lastTypedWord=document.querySelector(".word.current");
    const lastTypedWordiDX=words.indexOf(lastTypedWord);

    const typedWords=words.slice(0, lastTypedWordiDX);

    const correctWords=typedWords.filter(word => {
        const letters=[...word.children];
        const orangeLetters=letters.filter(letter => letter.className.includes("incorrect"));
        const whiteLetetrs=letters.filter(letter => letter.className.includes("correct"));
        return orangeLetters.length===0 && whiteLetetrs.length===letters.length;


    });

    return correctWords.length/gameTime*60000;
    
}


function gameOver(){
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const WPM=wordsWpm();
    document.getElementById('info').innerHTML=`WPM: ${WPM}`;
}

function resetGame() {
    // Reset game state
    clearInterval(window.timer);
    window.timer = null;
    window.gameStart = null;
    document.getElementById('info').innerHTML = (gameTime / 1000) + '';

    removeClass(document.getElementById('game'), 'over');
    
    newGame();

    // Reset cursor position
    const cursor = document.getElementById('cursor');
    const firstLetter = document.querySelector('.letter.current');

    if (firstLetter) {
        cursor.style.top = firstLetter.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = firstLetter.getBoundingClientRect().left + 'px';
    }
}



document.getElementById("game").addEventListener("keyup", ev =>{
    const key=ev.key;
    const currentWord=document.querySelector('.word.current')
    const currentLetter= document.querySelector(".letter.current");
    const expected=currentLetter?.innerHTML || ' ';
    const isLetter=key.length===1 && key !== ' ';
    const isSpace= key===' ';
    const isBackspace=key==='Backspace';
    const isFirstLetter=currentLetter===currentWord.firstChild;
    
    
    if(document.querySelector("#game.over")){
        return;
    }
    

    console.log({key,expected});

    if(!window.timer && isLetter){
        window.timer=setInterval(() => {
            if(!window.gameStart){
                window.gameStart=(new Date()).getTime();
            }
            const currentTime=(new Date()).getTime();
            const milipassed=currentTime-window.gameStart;
            const secPassed=Math.round(milipassed/1000);
            const sLeft=(gameTime/1000)-secPassed;
            if(sLeft<=0){
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML=sLeft+'';

        }, 1000);
    }

    if(isLetter){
        if(currentLetter){
            addClass(currentLetter, key===expected ? 'correct' : 'incorrect')
            removeClass(currentLetter, 'current');
            if(currentLetter.nextSibling){
                addClass(currentLetter.nextSibling, 'current');
                }
            } else{
                const incorrectLetter=document.createElement('span');
                incorrectLetter.innerHTML=key;
                incorrectLetter.className='letter incorrect extra';
                currentWord.appendChild(incorrectLetter);
        }
    }

    if(isSpace){
        if(expected !== ' '){
            const letterToInvalidate=[...document.querySelectorAll('.word.current .letter:not(.correct)')];
            letterToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');

        if(currentLetter){
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    if(isBackspace){
        if(currentLetter && isFirstLetter){
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if(currentLetter && !isFirstLetter){
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if(!currentLetter){
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
            
        }
    }

    if(currentWord.getBoundingClientRect().top>250){
        const words=document.getElementById("words");
        const margin=parseInt(words.style.marginTop || '0px');
        words.style.marginTop=margin-35+'px';
    }


    // cursor moving
    const nextLetter=document.querySelector('.letter.current');
    const nextWord=document.querySelector('.word.current');
    const cursor=document.getElementById('cursor');

    cursor.style.top=(nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left=nextLetter.getBoundingClientRect()[nextLetter? 'left' : right] + 'px';

})


document.getElementById("newGameBtn").addEventListener("click", () => {
    resetGame();
    document.getElementById('game').focus();
});

newGame();


