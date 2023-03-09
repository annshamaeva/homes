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

    // Добавляем выбор уровня и стилизуем кнопки

    // Выбираем кнопку и сохраняем результат
    // Создаем радио-кнопки выбора и кнопку начала игры
    const choiceButtonOne = document.createElement('input')
    choiceButtonOne.type = 'radio'
    choiceButtonOne.name = 'r'

    //радио-кнопка выбора
    const choiceButtonTwo = document.createElement('input')
    choiceButtonTwo.type = 'radio'
    choiceButtonTwo.name = 'r'

    //радио-кнопка выбора
    const choiceButtonThree = document.createElement('input')
    choiceButtonThree.type = 'radio'
    choiceButtonThree.name = 'r'

    //радио-кнопка выбора
    const button = document.createElement('button')
    button.textContent = 'Старт'
    // кнопка страта после выбора уровня

    let radios = document.querySelectorAll('input') // обращаемся ко всем радиокнопкам

    button.addEventListener('click', function () {
        // слушаем какая кнопка была выбрана в итоге
        let radio
        for (let radio of radios) {
            //ищем радиокнопку, которую выбрали среди всех радиокнопок
            console.log(radio.value) // выводим в консоль выбранную кнопку
        }
        console.log(radio)
    })

    // стилизуем кнопку старта
    button.classList.add('button')

    // стилизуем кнопку 1
    choiceButtonOne.classList.add('choice-button-one')

    // стилизуем кнопку 2
    choiceButtonTwo.classList.add('choice-button-two')

    // стилизуем кнопку 3
    choiceButtonThree.classList.add('choice-button-three')

    container.appendChild(title)
    container.appendChild(choiceButtonOne)
    container.appendChild(choiceButtonTwo)
    container.appendChild(choiceButtonThree)
    container.appendChild(button)

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

    if (
        choiceButtonOne === true &&
        choiceButtonTwo === false &&
        choiceButtonThree === false
    ) {
        renderLevelOneScreen()
    } else {
        false
    }

    if (
        choiceButtonOne === false &&
        choiceButtonTwo === true &&
        choiceButtonThree === false
    ) {
        renderLevelTwoScreen()
    } else {
        false
    }

    if (
        choiceButtonOne === false &&
        choiceButtonTwo === false &&
        choiceButtonThree === true
    ) {
        renderLevelThreeScreen()
    } else {
        false
    }
}

function renderButtonOne(container) {
    //стилизуем фон
    container.classList.add('container')

    let timerMinute = document.createElement('span[id="minute" label=00]')
    let timerSecond = document.createElement('span[id="second" label=00]')

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

    let timerMinute = document.createElement('span[id="minute" label=00]')
    let timerSecond = document.createElement('span[id="second" label=00]')

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

    let timerMinute = document.createElement('span[id="minute" label=00]')
    let timerSecond = document.createElement('span[id="second" label=00]')

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
