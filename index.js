window.application = {
    blocks: {},
    screens: {},
    renderScreen: function (screenName) {
        if (!window.application.screens[screenName]) {
            console.log('Такой страницы не существует')
        } else {
            this.screens[screenName]
        }
        window.application.timers.forEach((element) => {
            clearInterval(element)
        })
    },

    renderBlock: function (blockName, container) {
        if (!window.application.blocks[blockName]) {
            console.log('Такого блока не существует')
        } else {
            this.blocks[blockName](container)
        }
    },
    timers: [],
    level: [],
}

const memoryGame = document.querySelector('.memory-game')
memoryGame.style.display = 'none' //скрываем все карты

const button = document.querySelector('.button-level') //кнопка начала игры

button.addEventListener('click', () => {
    //событие по клику
    const formLevel = document.querySelector('.form-level')

    switch (
        formLevel //сравнить выражение сразу с несколькими вариантами проверки статусов игроков
    ) {
        case 'buttonOne':
            window.application.screens['screenLevelOne'] = screenLevelOne()
            window.application.screens.screenLevelOne
            break
        case 'buttonTwo':
            window.application.screens['screenLevelTwo'] = screenLevelTwo()
            window.application.screens.screenLevelTwo
            break
        case 'buttonThree':
            window.application.screens['screenLevelThree'] = screenLevelThree()
            window.application.screens.screenLevelThree
            break
        default: // иначе уровень не выбран
            console.log('Уровень сложности игры не выбран')
            break
    }
})

screenLevelOne.style.display = 'none'
screenLevelTwo.style.display = 'none'
screenLevelThree.style.display = 'none'

function screenLevelOne() {
    const buttonOne = document.querySelector('.button-one-level')
    buttonOne.addEventListener('click', () => {
        //событие по клику)
        const levelDiv = document.querySelector('.level-div')
        levelDiv.style.display = 'none' // блокируем экран с выбором уровня
        screenLevelOne.style.display = 'block'
        screenLevelTwo.style.display = 'none'
        screenLevelThree.style.display = 'none'
        const cards = document.querySelectorAll('.memory-card')

        shuffle()

        // описываем переворот карт и чтобы переворачивалось только две карты
        let hasFlippedCard = false
        let lockBoard = false
        let firstCard, secondCard

        function flipCard() {
            if (lockBoard) return
            if (this === firstCard) return

            this.classList.add('flip')

            if (!hasFlippedCard) {
                hasFlippedCard = true
                firstCard = this
                return
            }

            secondCard = this

            checkForMatch()
        }

        function checkForMatch() {
            let isMatch =
                firstCard.dataset.framework === secondCard.dataset.framework
            isMatch ? disableCards() : unflipCards()
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard)
            secondCard.removeEventListener('click', flipCard)

            resetBoard()
        }

        function unflipCards() {
            lockBoard = true

            setTimeout(() => {
                firstCard.classList.remove('flip')
                secondCard.classList.remove('flip')

                resetBoard()
            }, 1500)
        }

        function resetBoard() {
            ;[hasFlippedCard, lockBoard] = [false, false]
            ;[firstCard, secondCard] = [null, null]
        }

        //прописываем рандомное расположение карт
        function shuffle() {
            cards.forEach((card) => {
                let ramdomPos = Math.floor(Math.random(6) * 36)
                card.style.order = ramdomPos
            })
        }

        cards.forEach((card) => card.addEventListener('click', flipCard))
    })

    //устанавливаем таймер игры
    let timer
    let secs = 0
    if (timer) clearInterval(timer)
    secs = 0
    document.getElementById('timer').innerHTML = secs + ' сек.'
    timer = setInterval(function () {
        secs++
        document.getElementById('timer').innerHTML = secs + ' сек.'
    }, 1000)
}

function screenLevelTwo() {
    const buttonTwo = document.querySelector('.button-two-level')
    buttonTwo.addEventListener('click', () => {
        // событие по клику
        const levelDiv = document.querySelector('.level-div')
        levelDiv.style.display = 'none'
        screenLevelOne.style.display = 'none'
        screenLevelTwo.style.display = 'block'
        screenLevelThree.style.display = 'none'

        shuffle()

        let hasFlippedCard = false
        let lockBoard = false
        let firstCard, secondCard

        function flipCard() {
            if (lockBoard) return
            if (this === firstCard) return

            this.classList.add('flip')

            if (!hasFlippedCard) {
                hasFlippedCard = true
                firstCard = this
                return
            }

            secondCard = this

            checkForMatch()
        }

        function checkForMatch() {
            let isMatch =
                firstCard.dataset.framework === secondCard.dataset.framework
            isMatch ? disableCards() : unflipCards()
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard)
            secondCard.removeEventListener('click', flipCard)

            resetBoard()
        }

        function unflipCards() {
            lockBoard = true

            setTimeout(() => {
                firstCard.classList.remove('flip')
                secondCard.classList.remove('flip')

                resetBoard()
            }, 1500)
        }

        function resetBoard() {
            ;[hasFlippedCard, lockBoard] = [false, false]
            ;[firstCard, secondCard] = [null, null]
        }

        const cards = document.querySelectorAll('.memory-card')

        function shuffle() {
            cards.forEach((card) => {
                let ramdomPos = Math.floor(Math.random(12) * 36)
                card.style.order = ramdomPos
            })
        }
        cards.forEach((card) => card.addEventListener('click', flipCard))
    })
}

function screenLevelThree() {
    const buttonThree = document.querySelector('.button-three-level')
    buttonThree.addEventListener('click', () => {
        // событие по клику
        const levelDiv = document.querySelector('.level-div')
        levelDiv.style.display = 'none'
        screenLevelOne.style.display = 'none'
        screenLevelTwo.style.display = 'none'
        screenLevelThree.style.display = 'block'

        shuffle()

        let hasFlippedCard = false
        let lockBoard = false
        let firstCard, secondCard

        function flipCard() {
            if (lockBoard) return
            if (this === firstCard) return

            this.classList.add('flip')

            if (!hasFlippedCard) {
                hasFlippedCard = true
                firstCard = this
                return
            }

            secondCard = this

            checkForMatch()
        }

        function checkForMatch() {
            let isMatch =
                firstCard.dataset.framework === secondCard.dataset.framework
            isMatch ? disableCards() : unflipCards()
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard)
            secondCard.removeEventListener('click', flipCard)

            resetBoard()
        }

        function unflipCards() {
            lockBoard = true

            setTimeout(() => {
                firstCard.classList.remove('flip')
                secondCard.classList.remove('flip')

                resetBoard()
            }, 1500)
        }

        function resetBoard() {
            ;[hasFlippedCard, lockBoard] = [false, false]
            ;[firstCard, secondCard] = [null, null]
        }

        const cards = document.querySelectorAll('.memory-card')

        function shuffle() {
            cards.forEach((card) => {
                let ramdomPos = Math.floor(Math.random(18) * 36)
                card.style.order = ramdomPos
            })
        }
        cards.forEach((card) => card.addEventListener('click', flipCard))
    })
}
