import { Card, cardListData } from './scripts/cardListData'
//@ts-ignore
import * as _ from "lodash"

// Путь до картинки с рубашкой
export const CARD_SHIRT_SRC: string = '/static/img/shirt.svg'
// Путь до картинки с хлопушкой
const WIN_STICKER_SRC: string = '/static/img/flapper.svg'
// Путь до картинки со смайликом
const LOST_STICKER_SRC: string = '/static/img/smiley.svg'

export const LEVELS = {
  easy: 'easy',
  middle: 'middle',
  hard: 'hard',
}

// Высота и ширина поля с карточками в зависимости от уровня сложности
export const CARDS_TABLE_SIZE: { [index: string]: { height: number, width: number } } = {
  [LEVELS.easy]: { height: 2, width: 3 },
  [LEVELS.middle]: { height: 3, width: 4 },
  [LEVELS.hard]: { height: 3, width: 6 },
};

type ScreenRenderer = (app: App) => HTMLElement;

interface ScreenRenderers {
  [index: string]: ScreenRenderer;
}

type PopupRenderer = (app: App, e: HTMLElement) => void;

interface PopupRenderers {
  [index: string]: PopupRenderer;
}

interface State {
  [index: string]: any
}

export interface App {
  root: HTMLElement,
  screenRenderers: ScreenRenderers,
  popupRenderers: PopupRenderers,
  renderScreen: (name: string) => void,
  renderPopup: (name: string) => void,
  state: State
}

export function initApp(rootId: string, startScreenName: string, screenRenderers: ScreenRenderers, popupRenderers: PopupRenderers): App {
  const root: HTMLElement | null = document.getElementById(rootId);
  if (!root) {
    throw new Error('Element with id=' + rootId + ' not found');
  }

  const app: App = {
    root: root,
    // функции отрисовки экранов
    screenRenderers: screenRenderers,
    // функции отрисовки всплывающих окон
    popupRenderers: popupRenderers,
    // Вызываем функцию отрисовки экрана. Удаляем все внутри root и рендерим экран
    renderScreen(name: string): void {
      const renderer: ScreenRenderer | null = this.screenRenderers[name];
      if (!renderer) {
        throw new Error('Unknown screen: ' + name);
      }

      this.root.innerHTML = ''
      // Передаем состояние в функцию отрисовки
      this.root.appendChild(renderer(this))
    },

    renderPopup(name: string): void {
      const renderer: PopupRenderer | null = this.popupRenderers[name]
      if (!renderer) {
        throw new Error('Unknown popup: ' + name);
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
      renderer(this, popupContent)
    },

    // Переменные глобального состояния
    state: {
      // Выбранный уровень
      choosedLevel: '' as string,
      // соответствие id карты с url до основной картинки
      cardUrls: {} as { [index: string]: string },
      // Каждая первая перевернутая карта
      firstCard: null as Card | null,
      // Кол-во карт
      cardsCount: 0 as number,
      // Кол-во открытых карт
      openedCount: 0 as number,
      // Начальное время в миллисекундах
      startTime: null as number | null,
      // Данные таймера
      timer: {
        // id, полученное черep setInterval
        id: null as number | null,
        // Ссылка на элемент с минутами
        minutes: null as number | null,
        // Ссылка на элемент с секундами
        seconds: null as number | null,
      },
    },
  };

  window['application'] = app

  // рендерим начальный экран
  app.renderScreen(startScreenName)
  return app
}

// создаем экран выбора уровня сложности
export function renderChooseLevelScreen(app: App): HTMLElement {
  app.state.choosedLevel = ''

  //стилизуем экран выбора уровня
  // стилизуем фон
  const container: HTMLDivElement = document.createElement('div')
  container.classList.add('container')

  // Создаем заголовок
  const title: HTMLHeadingElement = document.createElement('h2')
  title.textContent = 'Выбери сложность'
  // Стилизация заголовка
  title.classList.add('title')
  container.appendChild(title)

  // Добавляем выбор уровня и стилизуем кнопки
  const divButton: HTMLDivElement = document.createElement('div')
  divButton.classList.add('choose-level-group')

  createChooseLevelGroup(app).forEach((label) => divButton.appendChild(label))

  container.appendChild(divButton)

  // Обертка для кнопки
  const startButtonWrapper: HTMLDivElement = document.createElement('div')
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

function createChooseLevelGroup(app: App): HTMLLabelElement[] {
  const selectedBtnClass: string = 'level-btn-selected'

  const labels: HTMLLabelElement[] = [
    createChooseLevelLabel('l1', '1', LEVELS.easy),
    createChooseLevelLabel('l2', '2', LEVELS.middle),
    createChooseLevelLabel('l3', '3', LEVELS.hard),
  ]

  for (const label of labels) {
    label.addEventListener('click', function (e: MouseEvent) {
      const button = e.target as HTMLButtonElement | null;

      for (const label of labels) {
        label.classList.remove(selectedBtnClass)
      }
      button?.classList.add(selectedBtnClass)

      const startButton = document.getElementById('start-button') as HTMLButtonElement | null
      if (startButton) {
        startButton.disabled = false
      }

      app.state.choosedLevel = button?.getAttribute('data-level')
    })
  }

  return labels
}

function createChooseLevelLabel(id: string, text: string, level: string): HTMLLabelElement {
  const label = document.createElement('label')
  label.id = id
  label.classList.add('button-level')
  label.innerHTML = text
  label.setAttribute('data-level', level)

  return label
}

// создаем экран с самой игрой
export function renderCardsGameScreen(app: App): HTMLElement {
  app.state.cardsCount = 0
  app.state.openedCount = 0
  app.state.firstCard = null

  const container: HTMLDivElement = document.createElement('div')

  // создаем заголовок
  const header: HTMLElement = document.createElement('header')

  // Создаем таймер
  const timer: HTMLDivElement = createTimerDiv()
  timer.classList.add('play-timer')
  header.appendChild(timer)

  // Создаем кнопку Начать заново
  const againButton: HTMLButtonElement = createButton('Начать заново', () => {
    app.renderScreen('chooseLevel')
  })
  againButton.classList.add('again-button')

  header.appendChild(againButton)
  container.appendChild(header)

  // Генерируем массив карт
  const { height, width } = CARDS_TABLE_SIZE[app.state.choosedLevel]
  app.state.cardsCount = height * width
  
  const cards: HTMLImageElement[] = generateCards(cardListData, width * height)
    .map((card) => createCardImg(card))

  // Формируем двумерный массив из карт
  const cardTable: HTMLImageElement[][] = []
  for (let rowI = 0; rowI < height; rowI++) {
    let cardsRow: HTMLImageElement[] = []
    for (let columnnI = 0; columnnI < width; columnnI++) {
      cardsRow.push(cards[rowI * width + columnnI])
    }
    cardTable.push(cardsRow)
  }

  // Создаем поле с картами
  const cardsField: HTMLTableElement = document.createElement('table')
  cardsField.classList.add('cards-field')
  cardTable.forEach((cardsRow) => {
    let cardsTr: HTMLTableRowElement = document.createElement('tr')

    cardsRow.forEach((card) => {
      let cardTd: HTMLTableCellElement = document.createElement('td')
      cardTd.appendChild(card)
      cardsTr.appendChild(cardTd)
    })

    cardsField.appendChild(cardsTr)
  })
  container.appendChild(cardsField)

  // Через 5 секунд скрываем карты
  setTimeout(() => {
    hideCards(app, cards)

    // Сохраняем ссылки на элементы частей таймера
    app.state.timer.minutes = document.getElementById('game-timer-minutes')
    app.state.timer.seconds = document.getElementById('game-timer-seconds')

    // Начинаем отсчет таймера
    app.state.startTime = Date.now()
    app.state.timer.id = setInterval(() => updateTimer(app), 1000)
  }, 5000)

  return container
}

// Генерируем массив из перетасованных пар карт
export function generateCards(cardsData: Card[], count: number): Card[] {
  // Берем случайные карты парами
  const cardList: Card[] = []
  const pairsCount: number = Math.floor(count / 2)

  for (let i = 0; i < pairsCount; i++) {
    let card: Card = pickRandomElement(cardsData)
    cardList.push(card)
    cardList.push(card)
  }
  shuffleArray(cardList)
  // Чтобы наверняка перетасовались
  shuffleArray(cardList)

  return cardList
}

export function shuffleArray<Type>(arr: Type[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

// Берем случайный элемент из массива
function pickRandomElement<Type>(cardsData: Type[]): Type {
  const index: number = Math.floor(Math.random() * cardsData.length)
  return cardsData[index]
}

// Переворачиваем все карты рубашкой вверх
function hideCards(app: App, cards: HTMLImageElement[]): void {
  app.state.cardUrls = {}

  cards.forEach((card) => {
    // Запоминаем, какие были пути до картинок
    app.state.cardUrls[card.id] = card.getAttribute('src')
    // Скрываем карту
    card.src = CARD_SHIRT_SRC
    card.setAttribute('data-is-opened', '0')

    card.addEventListener('click', (e: MouseEvent) => onCardShow(app, e));
  })
}

function updateTimer(app: App): void {
  // Получаем разницу в секундах
  const timeDiff = Math.floor((Date.now() - app.state.startTime) / 1000)

  // Обновляем показатели
  app.state.timer.minutes.innerText = formatTimerPartValue(
    Math.floor(timeDiff / 60)
  )
  app.state.timer.seconds.innerText = formatTimerPartValue(
    Math.floor(timeDiff % 60)
  )
}

export function formatTimerPartValue(value: number): string {
  return (value < 10 ? '0' : '') + value;

}

// Обрабатываем открытие карты
function onCardShow(app: App, e: Event): void {
  const card = e.target as HTMLImageElement | null
  if (!card) {
    throw new Error('Card not found');
  }

  const isOpened: string | null = card?.getAttribute('data-is-opened');
  if (!isOpened) {
    throw new Error('Attribute "data-is-opened" not specified');
  }

  // Если нажали на открытую карту
  if (parseInt(isOpened)) {
    return
  }

  const cardUrl: string = app.state.cardUrls[card.id]
  card.setAttribute('src', cardUrl)
  card.setAttribute('data-is-opened', '1')

  app.state.openedCount++

  // если выбрали первую карту из пары
  if (app.state.firstCard === null) {
    app.state.firstCard = card
  }
  // Если выбрали вторую карту
  else {
    // Если пути до передних картинок совпали
    if (app.state.cardUrls[app.state.firstCard.id] === cardUrl) {
      // Если кол-во открытых карт совпадает с кол-вом карт, то показываем окно с победой
      if (app.state.openedCount === app.state.cardsCount) {
        app.renderPopup('win')
      }
    } else {
      // Иначе проигрыш
      app.renderPopup('lost')
    }

    // Сбрасываем первую карту
    app.state.firstCard = null
  }
}

export function renderWinPopup(app: App, popupContent: HTMLElement): void {
  renderPopup(app, popupContent, 'Вы выиграли!', WIN_STICKER_SRC)
}

export function renderLostPopup(app: App, popupContent: HTMLElement): void {
  renderPopup(app, popupContent, 'Вы проиграли!', LOST_STICKER_SRC)
}

// Рендерим контент всплывающего окна
function renderPopup(app: App, popupContent: HTMLElement, title: string, stickerSrc: string): void {
  // Останавливаем таймер
  clearInterval(app.state.timer.id)
  // Показываем, что таймер неактуален
  app.state.timer.id = null

  // Создаем стикер
  const stickerImg: HTMLImageElement = document.createElement('img')
  stickerImg.src = stickerSrc
  stickerImg.classList.add('sticker')
  popupContent.appendChild(stickerImg)

  // Создаем заголовок
  const titleH2: HTMLHeadingElement = document.createElement('h2')
  titleH2.textContent = title
  // Стилизация заголовка
  titleH2.classList.add('title')
  popupContent.appendChild(titleH2)

  // Создаем заголовок таймера
  const timerTitleP: HTMLParagraphElement = document.createElement('p')
  timerTitleP.innerText = 'Затраченное время:'
  timerTitleP.classList.add('timer-title')
  popupContent.appendChild(timerTitleP)

  // Создаем таймер
  const timerDiv: HTMLDivElement = createTimerDiv(false)
  timerDiv.classList.add('end-timer')
  popupContent.appendChild(timerDiv)

  // Записываем значения в таймер
  const timerMinutes: HTMLElement | null = document.getElementById('end-timer-minutes')
  if (!timerMinutes) {
    throw new Error('Timer minutes element not found');
  }
  timerMinutes.innerText = app.state.timer.minutes.innerText

  const timerSeconds: HTMLElement | null = document.getElementById('end-timer-seconds')
  if (!timerSeconds) {
    throw new Error('Timer minutes element not found');
  }
  timerSeconds.innerText = app.state.timer.seconds.innerText

  // Обертка для кнопки
  const playAgainButtonWrapper: HTMLDivElement = document.createElement('div')
  // кнопка Играть снова
  const playAgainButton: HTMLButtonElement = createButton('Играть снова', () => {
    app.renderScreen('chooseLevel')
  })
  playAgainButton.id = 'play-again-button'
  playAgainButtonWrapper.appendChild(playAgainButton)

  popupContent.appendChild(playAgainButtonWrapper)
}

let cardI: number = 1

export function createCardImg(cardData: Card): HTMLImageElement {
  const card: HTMLImageElement = document.createElement('img')
  card.id = 'card-' + cardI++
  card.setAttribute('src', '/' + cardData.image)

  return card
}

// Создание таймера
export function createTimerDiv(isGameTimer: boolean = true): HTMLDivElement {
  const timer: HTMLDivElement = document.createElement('div')
  timer.classList.add('timer')

  timer.appendChild(
    createTimerPartSpan(
      'timer-minutes',
      isGameTimer ? 'min' : '',
      isGameTimer
    )
  )

  const dotSpan: HTMLSpanElement = document.createElement('span')
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
function createTimerPartSpan(id: string, label: string = '', isGameTimer: boolean = true): HTMLSpanElement {
  // Создаем контейнер с данными
  const partSpan: HTMLSpanElement = document.createElement('span')

  if (label) {
    // Создаем подпись
    const labelDiv: HTMLDivElement = document.createElement('div')
    labelDiv.classList.add('timer-label')
    labelDiv.innerText = label
    partSpan.appendChild(labelDiv)
  }

  // Создаем контейнер с числом
  const numberDiv: HTMLDivElement = document.createElement('div')
  numberDiv.classList.add('timer-number')
  numberDiv.id = (isGameTimer ? 'game-' : 'end-') + id
  numberDiv.innerText = '00'
  partSpan.appendChild(numberDiv)

  return partSpan
}

export function createButton(text: string, onClick: EventListener): HTMLButtonElement {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('button'),
    // обработчик нажатия
    button.addEventListener('click', onClick)

  return button
}
