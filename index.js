//import Img from './static/img/рубашка.svg'

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

function renderLevelButton(container) {
    //стилизуем экран выбора уровня
    // стилизуем фон
    container.classList.add('container')

    title.textContent = 'Выбери сложность'
    // Стилизация заголовка
    title.classList.add('title')
    container.appendChild(title)

    // Добавляем выбор уровня и стилизуем кнопки

    // Выбираем кнопку и сохраняем результат
    // Создаем радио-кнопки выбора и кнопку начала игры
    const choiceButtonOne = document.createElement('input')
    choiceButtonOne.type = 'radio'
    choiceButtonOne.name = 'r'
    choiceButtonOne.value = 'easy'
    choiceButtonOne.classList.add('choice-button-one')
    container.appendChild(choiceButtonOne)

    //радио-кнопка выбора
    const choiceButtonTwo = document.createElement('input')
    choiceButtonTwo.type = 'radio'
    choiceButtonTwo.name = 'r'
    choiceButtonTwo.value = 'middle'
    choiceButtonTwo.classList.add('choice-button-two')
    container.appendChild(choiceButtonTwo)
    //радио-кнопка выбора
    const choiceButtonThree = document.createElement('input')
    choiceButtonThree.type = 'radio'
    choiceButtonThree.name = 'r'
    choiceButtonThree.value = 'hard'
    choiceButtonThree.classList.add('choice-button-three')
    container.appendChild(choiceButtonThree)

    //радио-кнопка выбора
    const button = document.createElement('button')
    button.textContent = 'Старт'
    button.classList.add('button')
    container.appendChild(button)
    // кнопка страта после выбора уровня

    let radios = document.querySelectorAll('input') // обращаемся ко всем радиокнопкам

    button.addEventListener('click', function () {
        const radios = document.querySelectorAll('input')

        for (let i = 0; i < radios.length; i++) {
            /* console.log(radios[i].checked) */
            /* Если радио активен */
            if (radios[i].checked) {
                /* Записываем режим игры */
                gameMode = radios[i].value
                console.log(gameMode)
            }
        }
        if (choiceButtonOne.value) {
            renderLevelOneScreen()
        }
        if (choiceButtonTwo.value) {
            renderLevelTwoScreen()
        }
        if (choiceButtonThree.value) {
            renderLevelThreeScreen()
        }
    })

    setLevel()

    switch (
        radios //сравнить выражение сразу с несколькими вариантами проверки статусов игроков
    ) {
        case 'choiceButtonOne':
            window.application.screens['renderLevelOneScreen'] =
                renderLevelOneScreen()
            window.application.screens.screenLevelOne
            break
        case 'choiceButtonTwo':
            window.application.screens['renderLevelTwoScreen'] =
                renderLevelTwoScreen()
            window.application.screens.screenLevelTwo
            break
        case 'choiceButtonThree':
            window.application.screens['renderLevelThreeScreen'] =
                renderLevelThreeScreen()
            window.application.screens.screenLevelThree
            break
        default: // иначе уровень не выбран
            console.log('Уровень сложности игры не выбран')
            break
    }
}

let gameMode = ''

function setLevel() {
    let radios = document.querySelectorAll('input')
    console.log('🚀 ~ file: index.js:193 ~ setLevel ~ radios:', radios)
}

function renderButtonOne(container) {
    //стилизуем фон
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

    let currentRotation = 0

    currentRotation.addEventListener('click', function () {
        currentRotation += 90
        document.querySelector('#sample').style.transform =
            'rotate(' + currentRotation + 'deg)'
    })
}

function renderButtonTwo(container) {
    //стилизуем фон
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
}

function renderButtonThree(container) {
    //стилизуем фон
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
