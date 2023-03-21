import { cardListData } from './scripts/cardListData'

// Уровни сложности
const LEVEL_EASY = 'easy'
const LEVEL_MIDDLE = 'middle'
const LEVEL_HARD = 'hard'

// Путь до картинки с рубашкой
const CARD_SHIRT_SRC = '/static/img/shirt.svg'
// Путь до картинки с хлопушкой
const WIN_STICKER_SRC = '/static/img/flapper.svg'
// Путь до картинки со смайликом
const LOST_STICKER_SRC = '/static/img/smiley.svg'

// Высота и ширина поля с карточками в зависимости от уровня сложности
const CARDS_TABLE_SIZE = {
    [LEVEL_EASY]: { height: 2, width: 3 },
    [LEVEL_MIDDLE]: { height: 3, width: 4 },
    [LEVEL_HARD]: { height: 3, width: 6 },
}

function initApp(rootId, startScreenName, screenRenderers, popupRenderers) {
    const app = {
        root: document.getElementById(rootId),
        // функции отрисовки экранов
        screenRenderers: screenRenderers,
        // функции отрисовки всплывающих окон
        popupRenderers: popupRenderers,
        // Вызываем функцию отрисовки экрана. Удаляем все внутри root и рендерим экран
        renderScreen(name) {
            const renderer = this.screenRenderers[name]
            if (!renderer) {
                console.log('Unknown screen: ' + name)
                return
            }

            this.root.innerHTML = ''
            // Передаем состояние в функцию отрисовки
            this.root.appendChild(renderer(this))
        },

        renderPopup(name) {
            const renderer = this.popupRenderers[name]
            if (!renderer) {
                console.log('Unknown popup: ' + name)
                return
            }

            // Создаем всплывающее окно
            const popup = document.createElement('div')
            popup.classList.add('popup')

            // Создаем контейнер для отрисовки
            const popupContent = document.createElement('div')
            popupContent.classList.add('container', 'popup-container')
            popup.appendChild(popupContent)

            // Показываем окно
            this.root.appendChild(popup)

            // Передаем контейнер и состояние в функцию отрисовки
            renderer(popupContent, app)
        },

        // Переменные глобального состояния

        // Выбранный уровень
        choosedLevel: '',
        // соответствие id карты с url до основной картинки
        cardUrls: {},
        // Каждая первая перевернутая карта
        firstCard: undefined,
        // Кол-во карт
        cardsCount: 0,
        // Кол-во открытых карт
        openedCount: 0,
        // Начальное время в миллисекундах
        startTime: undefined,
        // Данные таймера
        timer: {
            // id, полученное чер setInterval
            id: undefined,
            // Ссылка на элемент с минутами
            minutes: undefined,
            // Ссылка на элемент с секундами
            seconds: undefined,
        },
    }

    window.application = app

    // рендерим начальный экран
    app.renderScreen(startScreenName)
    return app
}

const app = initApp(
    'root',
    'chooseLevel',
    {
        chooseLevel: renderChooseLevelScreen,
        cardsGame: renderCardsGameScreen,
    },
    {
        win: renderWinPopup,
        lost: renderLostPopup,
    }
)

// создаем экран выбора уровня сложности
function renderChooseLevelScreen(app) {
    app.choosedLevel = ''

    //стилизуем экран выбора уровня
    // стилизуем фон
    const container = document.createElement('div')
    container.classList.add('container')

    // Создаем заголовок
    const title = document.createElement('h2')
    title.textContent = 'Выбери сложность'
    // Стилизация заголовка
    title.classList.add('title')
    container.appendChild(title)

    // Добавляем выбор уровня и стилизуем кнопки
    const divButton = document.createElement('div')
    divButton.classList.add('choose-level-group')

    createChooseLevelGroup().forEach((label) => divButton.appendChild(label))

    container.appendChild(divButton)

    // Обертка для кнопки
    const startButtonWrapper = document.createElement('div')
    // кнопка старта
    const startButton = createButton('Старт', () => {
        app.renderScreen('cardsGame')
    })
    startButton.id = 'start-button'
    startButton.disabled = true

    startButtonWrapper.appendChild(startButton)

    container.appendChild(startButtonWrapper)
    return container
}

function createChooseLevelGroup() {
    const selectedBtnClass = 'level-btn-selected'

    const labels = [
        createChooseLevelLabel('l1', '1', LEVEL_EASY),
        createChooseLevelLabel('l2', '2', LEVEL_MIDDLE),
        createChooseLevelLabel('l3', '3', LEVEL_HARD),
    ]

    for (const label of labels) {
        label.addEventListener('click', function (e) {
            for (const label of labels) {
                label.classList.remove(selectedBtnClass)
            }
            e.target.classList.add(selectedBtnClass)

            const startButton = document.getElementById('start-button')
            startButton.disabled = false

            app.choosedLevel = e.target.getAttribute('data-level')
        })
    }

    return labels
}

function createChooseLevelLabel(id, text, level) {
    const label = document.createElement('label')
    label.id = id
    label.classList.add('button-level')
    label.innerHTML = text
    label.setAttribute('data-level', level)

    return label
}

// создаем экран с самой игрой
function renderCardsGameScreen(app) {
    app.cardsCount = 0
    app.openedCount = 0
    app.firstCard = undefined

    const container = document.createElement('div')

    // создаем заголовок
    const header = document.createElement('header')

    // Создаем таймер
    const timer = createTimerDiv()
    timer.classList.add('play-timer')
    header.appendChild(timer)

    // Создаем кнопку Начать заново
    const againButton = createButton('Начать заново', () => {
        app.renderScreen('chooseLevel')
    })
    againButton.classList.add('again-button')

    header.appendChild(againButton)
    container.appendChild(header)

    // Генерируем массив карт
    const { height, width } = CARDS_TABLE_SIZE[app.choosedLevel]
    app.cardsCount = height * width
    const cards = generateCards(cardListData, width, height).map((card) =>
        createCardImg(card)
    )

    // Формируем двумерный массив из карт
    const cardTable = []
    for (let rowI = 0; rowI < height; rowI++) {
        let cardsRow = []
        for (let columnnI = 0; columnnI < width; columnnI++) {
            cardsRow.push(cards[rowI * width + columnnI])
        }
        cardTable.push(cardsRow)
    }

    // Создаем поле с картами
    const cardsField = document.createElement('table')
    cardsField.classList.add('cards-field')
    cardTable.forEach((cardsRow) => {
        let cardsTr = document.createElement('tr')

        cardsRow.forEach((card) => {
            let cardTd = document.createElement('td')
            cardTd.appendChild(card)
            cardsTr.appendChild(cardTd)
        })

        cardsField.appendChild(cardsTr)
    })
    container.appendChild(cardsField)

    // Через 5 секунд скрываем карты
    setTimeout(() => {
        hideCards(cards)

        // Сохраняем ссылки на элементы частей таймера
        app.timer.minutes = document.getElementById('game-timer-minutes')
        app.timer.seconds = document.getElementById('game-timer-seconds')

        // Начинаем отсчет таймера
        app.startTime = Date.now()
        app.timer.id = setInterval(() => updateTimer(app), 1000)
    }, 5000)

    return container
}

// Генерируем массив из перетасованных пар карт
function generateCards(cardsData, width, height) {
    // Берем случайные карты парами
    const cardList = []
    const pairsCount = Math.floor((width * height) / 2)

    for (let i = 0; i < pairsCount; i++) {
        let card = pickRandomCard(cardsData)
        cardList.push(card)
        cardList.push(card)
    }
    shuffleArray(cardList)
    // Чтобы наверняка перетасовались
    shuffleArray(cardList)

    return cardList
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
}

// Берем случайную карту из списка
function pickRandomCard(cardsData) {
    const index = Math.floor(Math.random() * cardsData.length)
    return cardsData[index]
}

// Переворачиваем все карты рубашкой вверх
function hideCards(cards) {
    app.cardUrls = {}

    cards.forEach((card) => {
        // Запоминаем, какие были пути до картинок
        app.cardUrls[card.id] = card.src
        // Скрываем карту
        card.src = CARD_SHIRT_SRC
        card.setAttribute('data-is-opened', '0')

        card.addEventListener('click', onCardShow)
    })
}

function updateTimer(app) {
    // Получаем разницу в секундах
    const timeDiff = Math.floor((Date.now() - app.startTime) / 1000)

    // Обновляем показатели
    app.timer.minutes.innerText = formatTimerPartValue(
        Math.floor(timeDiff / 60)
    )
    app.timer.seconds.innerText = formatTimerPartValue(
        Math.floor(timeDiff % 60)
    )
}

function formatTimerPartValue(value) {
    if (value < 10) {
        value = '0' + value
    }
    return value
}

// Обрабатываем открытие карты
function onCardShow(e) {
    const card = e.target
    // Если нажали на открытую карту
    if (parseInt(card.getAttribute('data-is-opened'))) {
        return
    }

    const cardUrl = app.cardUrls[card.id]
    card.setAttribute('src', cardUrl)
    card.setAttribute('data-is-opened', '1')

    app.openedCount++

    // если выбрали первую карту из пары
    if (app.firstCard === undefined) {
        app.firstCard = card
    }
    // Если выбрали вторую карту
    else {
        // Если пути до передних картинок совпали
        if (app.cardUrls[app.firstCard.id] === cardUrl) {
            // Если кол-во открытых карт совпадает с кол-вом карт, то показываем окно с победой
            if (app.openedCount === app.cardsCount) {
                app.renderPopup('win')
            }
        } else {
            // Иначе проигрыш
            app.renderPopup('lost')
        }

        // Сбрасываем первую карту
        app.firstCard = undefined
    }
}

function renderWinPopup(popupContent, app) {
    renderPopup(popupContent, app, 'Вы выиграли!', WIN_STICKER_SRC)
}

function renderLostPopup(popupContent, app) {
    renderPopup(popupContent, app, 'Вы проиграли!', LOST_STICKER_SRC)
}

// Рендерим контент всплывающего окна
function renderPopup(popupContent, app, title, stickerSrc) {
    // Останавливаем таймер
    clearInterval(app.timer.id)
    // Показываем, что таймер неактуален
    app.timer.id = undefined

    // Создаем стикер
    const stickerImg = document.createElement('img')
    stickerImg.src = stickerSrc
    stickerImg.classList.add('sticker')
    popupContent.appendChild(stickerImg)

    // Создаем заголовок
    const titleH2 = document.createElement('h2')
    titleH2.textContent = title
    // Стилизация заголовка
    titleH2.classList.add('title')
    popupContent.appendChild(titleH2)

    // Создаем заголовок таймера
    const timerTitleP = document.createElement('p')
    timerTitleP.innerText = 'Затраченное время:'
    timerTitleP.classList.add('timer-title')
    popupContent.appendChild(timerTitleP)

    // Создаем таймер
    const timerDiv = createTimerDiv(false)
    timerDiv.classList.add('end-timer')
    popupContent.appendChild(timerDiv)

    // Записываем значения в таймер
    const timerMinutes = document.getElementById('end-timer-minutes')
    timerMinutes.innerText = app.timer.minutes.innerText
    const timerSeconds = document.getElementById('end-timer-seconds')
    timerSeconds.innerText = app.timer.seconds.innerText

    // Обертка для кнопки
    const playAgainButtonWrapper = document.createElement('div')
    // кнопка Играть снова
    const playAgainButton = createButton('Играть снова', () => {
        app.renderScreen('chooseLevel')
    })
    playAgainButton.id = 'play-again-button'
    playAgainButtonWrapper.appendChild(playAgainButton)

    popupContent.appendChild(playAgainButtonWrapper)
}

let cardI = 1

function createCardImg(cardData) {
    const card = document.createElement('img')
    card.id = 'card-' + cardI++
    card.setAttribute('src', '/' + cardData.image)

    return card
}

// Создание таймера
function createTimerDiv(isGameTimer = true) {
    const timer = document.createElement('div')
    timer.classList.add('timer')

    timer.appendChild(
        createTimerPartSpan(
            'timer-minutes',
            isGameTimer ? 'min' : '',
            isGameTimer
        )
    )

    const dotSpan = document.createElement('span')
    dotSpan.classList.add('timer-number')
    dotSpan.innerText = '.'
    timer.appendChild(dotSpan)

    timer.appendChild(
        createTimerPartSpan(
            'timer-seconds',
            isGameTimer ? 'sek' : '',
            isGameTimer
        )
    )

    return timer
}

// Создание части таймера (блока с минутами или секундами)
function createTimerPartSpan(id, label = '', isGameTimer = true) {
    // Создаем контейнер с данными
    const partSpan = document.createElement('span')

    if (label) {
        // Создаем подпись
        const labelDiv = document.createElement('div')
        labelDiv.classList.add('timer-label')
        labelDiv.innerText = label
        partSpan.appendChild(labelDiv)
    }

    // Создаем контейнер с числом
    const numberDiv = document.createElement('div')
    numberDiv.classList.add('timer-number')
    numberDiv.id = (isGameTimer ? 'game-' : 'end-') + id
    numberDiv.innerText = '00'
    partSpan.appendChild(numberDiv)

    return partSpan
}

function createButton(text, onClick) {
    const button = document.createElement('button')
    button.textContent = text
    button.classList.add('button'),
        // обработчик нажатия
        button.addEventListener('click', onClick)

    return button
}
