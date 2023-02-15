window.application = {
    blocks: {},
    screens: {},
    renderScreen: function (screenName) {
        if (!window.application.screens[screenName]) {
            console.log('Такой страницы не существует');
        } else {
            this.screens[screenName];
        };
        window.application.timers.forEach(element => {
            clearInterval(element)
        });
    },

    renderBlock: function (blockName, container) {
        if (!window.application.blocks[blockName]) {
            console.log('Такого блока не существует');
        } else {
            this.blocks[blockName](container);
        };
    },
    timers: [],
    level: [],
};

window.application.screens['renderLevelButton'] = renderLevelButton();
window.application.screens.renderLevelButton;
const memoryGame = document.querySelector(".memory-game");
memoryGame.style.display = 'none'

function renderLevelButton() {
    const container = document.querySelector(".container-level");
    const formLevel = document.querySelector(".form-level")
    const buttonOne = document.querySelector(".buttonOne-level");
    const buttonTwo = document.querySelector(".buttonTwo-level");
    const buttonThree = document.querySelector(".buttonThree-level");
    const button = document.querySelector(".button-level");
}

button.addEventListener('click', () => { //событие по клику
    request({ //запрос на проверку уровня
        params: { level },
        onSuccess: (data) => {
            const formLevel = data['level'].status;

            switch (formLevel) { //сравнить выражение сразу с несколькими вариантами проверки статусов игроков
                case 'buttonOne':
                window.application.screens['screenLevelOne'] = screenLevelOne();
                window.application.screens.screenLevelOne;
                    break;
                case 'buttonTwo':
                window.application.screens['screenLevelTwo'] = screenLevelTwo();
                window.application.screens.screenLevelTwo;
                    break;
                case 'buttonThree':
                window.application.screens['screenLevelThree'] = screenLevelThree();
                window.application.screens.screenLevelThree;
                    break;
                default: // иначе уровень не выбран
                    console.log('Уровень сложности игры не выбран');
                    break;
            }
        }
    })
})

function start_timer()
    {
        if (timer) clearInterval(timer);
        secs = 0;
        document.getElementById('timer').innerHTML = secs + ' сек.';
        timer = setInterval(
            function () {
                secs++;
                document.getElementById('timer').innerHTML = secs + ' сек.';
            },
            1000
        );            
    }

buttonOne.addEventListener('click', () => { //событие по клику)
    const levelDiv = document.querySelector(".level-div");
    levelDiv.style.display = 'block';
    const cards = document.querySelectorAll('.memory-card');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
  
    function flipCard() {
      if (lockBoard) return;
    if (this === firstCard) return;
  
      this.classList.add('flip');
  
      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }
  
      secondCard = this;

  
      checkForMatch();
    }
  
    function checkForMatch() {
      let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
      isMatch ? disableCards() : unflipCards();
    }
  
    function disableCards() {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
  
     resetBoard();
    }
  
    function unflipCards() {
      lockBoard = true;
  
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
  
 
       resetBoard();
      }, 1500);
    }
  
   function resetBoard() {
     [hasFlippedCard, lockBoard] = [false, false];
     [firstCard, secondCard] = [null, null];
   }
  
   (function shuffle() {
       cards.forEach(card => {
         let ramdomPos = Math.floor(Math.random() * 36);
         card.style.order = ramdomPos;
       });
     })();
   
    cards.forEach(card => card.addEventListener('click', flipCard));
})