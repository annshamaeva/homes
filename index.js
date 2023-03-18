import { cardListData } from './scripts/cardListData'
console.log(cardListData)

// начинаем с глобального состояния
window.application = {
    // создаем окно приложения/игры
    blocks: {},
    screens: {},
    renderScreen: function (screenName) {
        //проверка наличия рабочего экрана игры
        if (!window.application.screens[screenName]) {
            // screens - экран, в котором все визуализируется
            console.log('Такой страницы не существует')
        } else {
            this.screens[screenName]
        }
        window.application.timers.forEach((element) => {
            clearInterval(element)
        })
    },

    renderBlock: function (blockName, container) {
        //проверка наличия работающего блока
        if (!window.application.blocks[blockName]) {
            console.log('Такого блока не существует')
        } else {
            this.blocks[blockName](container)
        }
    },
    timers: [], // сохранение затраченного времени
    level: [], // сохранение выбранного уровня
}

// добавляем наши будущие экраны

window.application.screens = {
    //создаем экраны для всей игры
    'level-choice': renderLevelScreen,
    'level-one': renderLevelOneScreen,
    'level-two': renderLevelTwoScreen,
    'level-three': renderLevelThreeScreen,
    // win: renderWinScreen,
    // lose: renderLoseScreen,
}

window.application.blocks = {
    // создаем блоки для всей игры, чтобы работать с ними
    'level-button': renderLevelButton,
    'button-one': renderButtonOne,
    'button-two': renderButtonTwo,
    'button-three': renderButtonThree,
    //  'win-text': renderWinText,
    //  'lose-text': renderLoseText,
}

//Затем обращаемся к нашему диву и объявляем необходимые переменные, в том числе создаем элемент с подзаголовком

const app = document.querySelector('.root')
// обратились к единственному уже существующему диву

//стилизуем фон

const title = document.createElement('h2')
// создаем заголовок

// Рендерим страницу с выбором уровня, отрисовывая нужные элементы и добавляем событие по клику, где перебрасывает на уровни

function renderLevelButton() {
    //стилизуем экран выбора уровня
    // стилизуем фон
    const container = document.createElement('div')
    container.classList.add('container')

    title.textContent = 'Выбери сложность'
    // Стилизация заголовка
    title.classList.add('title')
    container.appendChild(title)

    // Добавляем выбор уровня и стилизуем кнопки

    // Выбираем кнопку и сохраняем результат
    // Создаем радио-кнопки выбора и кнопку начала игры

    const prodCheckbox = document.createElement('div')
    prodCheckbox.classList.add('prod-checkbox')

    const divButton = document.createElement('div')
    divButton.classList.add('div-button')

    const choiceButtonOne = document.createElement('input')
    choiceButtonOne.type = 'radio'
    choiceButtonOne.name = 'r'
    choiceButtonOne.value = 'easy'
    choiceButtonOne.id = 'l1'
    choiceButtonOne.classList.add('choice-button-one')

    const label1 = document.createElement('label')
    label1.setAttribute('for', 'l1')
    label1.innerHTML = '1'
    divButton.appendChild(label1)
    divButton.appendChild(choiceButtonOne)

    //радио-кнопка выбора
    const choiceButtonTwo = document.createElement('input')
    choiceButtonTwo.type = 'radio'
    choiceButtonTwo.name = 'r'
    choiceButtonTwo.value = 'middle'
    choiceButtonTwo.id = 'l2'
    choiceButtonTwo.classList.add('choice-button-two')

    const label2 = document.createElement('label')
    label2.setAttribute('for', 'l2')
    label2.innerHTML = '2'
    divButton.appendChild(label2)
    divButton.appendChild(choiceButtonTwo)

    //радио-кнопка выбора
    const choiceButtonThree = document.createElement('input')
    choiceButtonThree.type = 'radio'
    choiceButtonThree.name = 'r'
    choiceButtonThree.value = 'hard'
    choiceButtonThree.id = 'l3'
    choiceButtonThree.classList.add('choice-button-three')

    const label3 = document.createElement('label')
    label3.setAttribute('for', 'l3')
    label3.innerHTML = '3'
    divButton.appendChild(label3)
    divButton.appendChild(choiceButtonThree)

    //радио-кнопка выбора
    const divStart = document.createElement('div')
    const button = document.createElement('button')
    button.textContent = 'Старт'
    button.classList.add('button')
    button.id = 'button'
    divStart.appendChild(button)
    // кнопка страта после выбора уровня

    button.addEventListener('click', function () {
        const radios = document.querySelectorAll('input') // обращаемся ко всем радиокнопкам

        for (let i = 0; i < radios.length; i++) {
            /* console.log(radios[i].checked) */
            /* Если радио активен */
            if (radios[i].checked) {
                /* Записываем режим игры */
                gameMode = radios[i].value
                console.log(gameMode)
            }
        }
    })

    setLevel()

    prodCheckbox.appendChild(divButton)
    container.appendChild(prodCheckbox)
    container.appendChild(divStart)
    app.appendChild(container)
}

let gameMode = ''

function setLevel() {
    let radios = document.querySelectorAll('input')
    console.log('🚀 ~ file: index.js:193 ~ setLevel ~ radios:', radios)
}

function renderButtonOne() {
    //стилизуем фон
    const container = document.createElement('div')
    container.classList.add('container')

    let timerMinute = document.createElement('span')
    timerMinute.id = 'minute'
    timerMinute.label = '00'
    let timerSecond = document.createElement('span')
    timerSecond.id = 'second'
    timerSecond.label = '00'

    let timer = 0
    let timerInterval
    const second = document.getElementById('second')
    const minute = document.getElementById('minute')

    renderLevelButton()
    finalTimer()

    timerInterval = setInterval(function () {
        timer += 1 / 60
        timerSecond = Math.floor(timer) - Math.floor(timer / 60) * 60
        timerMinute = Math.floor(timer / 60)
        second.innerHTML =
            timerSecond < 10 ? '0' + timerSecond.toString() : timerSecond
        minute.innerHTML =
            timerMinute < 10 ? '0' + timerMinute.toString() : timerMinute
    }, 1000 / 60)

    function finalTimer() {
        clearInterval(timerInterval)
    }

    // стилизуем секундомер
    timerInterval.classList.add('startTimer')

    const array = []
    for (let i = 0; i < 3; i++) {
        const random = Math.floor(Math.random() * cardListData.length)
        array.push(cardListData[random])
        // shuffle(arrayNew);
    }
    const arrayNew = array.concat(array)
    console.log(arrayNew)

    // Количество отгаданных пар
    //  let moves = 0 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    let firstCard
    let secondCard
    let isCardFlipped = false

    // eslint-disable-next-line no-inner-declarations
    function flipCard() {
        console.log('flipping card')
        // Если уже была выбрана первая карта повторно, то выходим из функции
        if (firstCard === this) return
        // Если карта ни разу не была перевернута, то это первая карта
        if (!isCardFlipped) {
            // присваиваем карту
            firstCard = this
            // Задаем в переменную, что мы перевернули карту
            isCardFlipped = true
            // выходим из функции
            return
        }
        // в теле функции код дошел до этой строчки
        // значит не было выхода из функции и карта уже была перевернута (isCardFlipped равен true)
        // присваиваем как вторую карту
        secondCard = this

        // вызов функции проверки внутри функции flipCard, так как она будет вызываться при клике на карту
        checkWin()
    }

    // Вызываем функцию проверки карты
    function checkWin() {
        // Смотрим, какие у них data атрибуты
        console.log('check first card: ', firstCard.dataset.framework)
        console.log('check second card: ', secondCard.dataset.framework)

        let winResult = false

        if (firstCard.dataset.framework === secondCard.dataset.framework) {
            winResult = true
            // Увеличиваем значение угаданных пар
            // moves++ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }

        console.log('🚀 ~ file: level.js:58 ~ checkWin ~ winResult:', winResult)

        if (winResult /* && moves === 3 */) {
            alert('Вы победили')
        }

        // Если количество попыток для данного уровня сложност достигнуто
        // показываем надпись Вы выиграли
    }
    arrayNew.forEach((card) => {
        const cardElem = document.createElement(card.elem)
        cardElem.setAttribute('src', card.src)

        // Задаем data атрибут, значение равно пути до картинки
        cardElem.setAttribute('data-framework', card.src)

        container.appendChild(cardElem)
        function coupCard() {
            cardElem.setAttribute('src', card.cardShirt)
        }
        setTimeout(coupCard, 5000)
        cardElem.addEventListener('click', flipCard)
        cardElem.addEventListener('click', function () {
            cardElem.setAttribute('src', card.src)
        })
    })

    const buttonAgain = document.createElement('button')
    finalTimer()

    // стилизуем кнопку игры заново
    buttonAgain.classList.add('buttonAgain')

    // поворачиваем рубашку карты
    //    if (window.application.level == "level-one") {
    //        for (let i = 0; i < 3; i++) {
    //            const random = Math.floor(Math.random() * Object.values(cards).length);
    //            array.push(Object.values(cards)[random].src);
    //            array = array.concat(array);
    //            shuffle(array);
    //        }
    //
    //        array.forEach((value) => {
    //            const card = document.createElement("img");
    //            card.setAttribute("src", value);
    //            card.classList.add("card", "card_hidden");
    //            cardField.appendChild(card);
    //        })
    //    }

    //    function shuffle() {
    //        // рандом на 6 карт
    //        cards.forEach((card) => {
    //            let ramdomPos = Math.floor(Math.random(6) * 36)
    //            card.style.order = ramdomPos
    //        })
    //    }

    // по клику поворачиваем карту лицом на время
    //let currentRotation = 0
    //
    //currentRotation.addEventListener('click', function () {
    //    currentRotation += 90
    //    document.querySelector('#sample').style.transform =
    //        'rotate(' + currentRotation + 'deg)'
    //})
    //app.appendChild(container)
}

function renderButtonTwo() {
    //стилизуем фон
    const container = document.createElement('div')
    container.classList.add('container')

    let timerMinute = document.createElement('span')
    timerMinute.id = 'minute'
    timerMinute.label = '00'
    let timerSecond = document.createElement('span')
    timerSecond.id = 'second'
    timerSecond.label = '00'

    let timer = 0
    let timerInterval
    const second = document.getElementById('second')
    const minute = document.getElementById('minute')

    renderLevelButton()
    finalTimer()

    timerInterval = setInterval(function () {
        timer += 1 / 60
        timerSecond = Math.floor(timer) - Math.floor(timer / 60) * 60
        timerMinute = Math.floor(timer / 60)
        second.innerHTML =
            timerSecond < 10 ? '0' + timerSecond.toString() : timerSecond
        minute.innerHTML =
            timerMinute < 10 ? '0' + timerMinute.toString() : timerMinute
    }, 1000 / 60)

    function finalTimer() {
        clearInterval(timerInterval)
    }

    // стилизуем секундомер
    timerInterval.classList.add('startTimer')

    const buttonAgain = document.createElement('button')
    finalTimer()

    // стилизуем кнопку игры заново
    buttonAgain.classList.add('buttonAgain')

    // поворачиваем рубашку карты

    //    function shuffle() {
    //        // рандом на 6 карт
    //        cards.forEach((card) => {
    //            let ramdomPos = Math.floor(Math.random(6) * 36)
    //            card.style.order = ramdomPos
    //        })
    //    }

    let currentRotation = 0

    currentRotation.addEventListener('click', function () {
        currentRotation += 90
        document.querySelector('#sample').style.transform =
            'rotate(' + currentRotation + 'deg)'
    })
    app.appendChild(container)
}

function renderButtonThree() {
    //стилизуем фон
    const container = document.createElement('div')
    container.classList.add('container')

    let timerMinute = document.createElement('span')
    timerMinute.id = 'minute'
    timerMinute.label = '00'
    let timerSecond = document.createElement('span')
    timerSecond.id = 'second'
    timerSecond.label = '00'

    let timer = 0
    let timerInterval
    const second = document.getElementById('second')
    const minute = document.getElementById('minute')

    renderLevelButton()
    finalTimer()

    timerInterval = setInterval(function () {
        timer += 1 / 60
        timerSecond = Math.floor(timer) - Math.floor(timer / 60) * 60
        timerMinute = Math.floor(timer / 60)
        second.innerHTML =
            timerSecond < 10 ? '0' + timerSecond.toString() : timerSecond
        minute.innerHTML =
            timerMinute < 10 ? '0' + timerMinute.toString() : timerMinute
    }, 1000 / 60)

    function finalTimer() {
        clearInterval(timerInterval)
    }

    // стилизуем секундомер
    timerInterval.classList.add('startTimer')

    const buttonAgain = document.createElement('button')
    finalTimer()

    // стилизуем кнопку игры заново
    buttonAgain.classList.add('buttonAgain')

    // поворачиваем рубашку карты

    //    function shuffle() {
    //        // рандом на 6 карт
    //        cards.forEach((card) => {
    //            let ramdomPos = Math.floor(Math.random(6) * 36)
    //            card.style.order = ramdomPos
    //        })
    //    }

    let currentRotation = 0

    currentRotation.addEventListener('click', function () {
        currentRotation += 90
        document.querySelector('#sample').style.transform =
            'rotate(' + currentRotation + 'deg)'
    })
    app.appendChild(container)
}

function renderLevelScreen() {
    // экран выбора уровня
    app.textContent = ''

    const content = document.createElement('div') // создаем новый див

    window.application.renderBlock('level-button', content) // показываем блок выбора уровня

    // добавляем в DOM дерево
    app.appendChild(content)
}

function renderLevelOneScreen() {
    // экран 1 уровня
    app.textContent = ''

    const content = document.createElement('div') // создаем новый див

    window.application.renderBlock('button-one', content) // показываем игру первого уровня
    window.application.renderBlock('button-again', content) // показываем кнопку игры заново

    // добавляем в DOM дерево
    app.appendChild(content)
}

function renderLevelTwoScreen() {
    // экран 2 уровня
    app.textContent = ''

    const content = document.createElement('div') // создаем новый див

    window.application.renderBlock('button-two', content) // показываем игру второго уровня
    window.application.renderBlock('button-again', content) // показываем кнопку игры заново

    // добавляем в DOM дерево
    app.appendChild(content)
}

function renderLevelThreeScreen() {
    // экран 3 уровня
    app.textContent = ''

    const content = document.createElement('div') // создаем новый див

    window.application.renderBlock('button-three', content) // показываем игру третьего уровня
    window.application.renderBlock('button-again', content) // показываем кнопку игры заново

    // добавляем в DOM дерево
    app.appendChild(content)
}

renderLevelScreen()
