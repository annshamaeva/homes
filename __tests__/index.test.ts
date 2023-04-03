import { test, beforeEach } from '@jest/globals'
import { Card, cardListData } from '../scripts/cardListData'

import * as gameLogic from '../gameLogic';
import { App } from '../gameLogic';

jest.useFakeTimers();

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>'

  // По-умолчанию делаем короткие таймеры
  jest.advanceTimersByTime(1);
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

const generatedCards: Card[] = [
  cardListData[0],
  cardListData[0],
  cardListData[1],
  cardListData[1],
  cardListData[2],
  cardListData[2],
];

describe('Unit tests', () => {
  test.each([
    { value: 0, expected: '00' },
    { value: 1, expected: '01' },
    { value: 9, expected: '09' },
    { value: 10, expected: '10' },
    { value: 59, expected: '59' },
  ])('formatTimerPartValue is correct', ({ value, expected }) => {
    expect(gameLogic.formatTimerPartValue(value)).toMatch(expected);
  });

  test('createCardImg is correct', () => {
    expect(
      gameLogic.createCardImg(cardListData[0]).outerHTML
    ).toBe(
      '<img id="card-1" src="/static/img/6_hearts.svg">'
    )
  });

  test('createTimerDiv is correct', () => {
    // Таймер в игре
    expect(
      gameLogic.createTimerDiv(true).outerHTML
    ).toBe(
      '<div class="timer">' +
      '<span>' +
      '<div class="timer-label"></div>' +
      '<div class="timer-number" id="game-timer-minutes"></div>' +
      '</span>' +
      '<span class="timer-number"></span>' +
      '<span>' +
      '<div class="timer-label"></div>' +
      '<div class="timer-number" id="game-timer-seconds"></div>' +
      '</span>' +
      '</div>'
    );

    // Таймер в попапе
    expect(
      gameLogic.createTimerDiv(false).outerHTML
    ).toBe(
      '<div class="timer">' +
      '<span>' +
      '<div class="timer-number" id="end-timer-minutes"></div>' +
      '</span>' +
      '<span class="timer-number"></span>' +
      '<span>' +
      '<div class="timer-number" id="end-timer-seconds"></div>' +
      '</span>' +
      '</div>'
    );
  });

  test('createButton is correct', () => {
    const mock = jest.fn();
    const button = gameLogic.createButton('some text', mock);

    expect(
      button.outerHTML
    ).toBe(
      '<button class="button">some text</button>'
    );

    button.click();
    expect(mock).toBeCalledTimes(1);
  });
});

function initApp(): App {
  return gameLogic.initApp(
    'root',
    'chooseLevel',
    {
      chooseLevel: gameLogic.renderChooseLevelScreen,
      cardsGame: gameLogic.renderCardsGameScreen,
    },
    {
      win: gameLogic.renderWinPopup,
      lost: gameLogic.renderLostPopup,
    }
  );
}

describe('Integration tests', () => {
  test('Choosing level works correctly', () => {
    const app = initApp();
    app.renderScreen = jest.fn();

    expect(app.state.choosedLevel).toBe('');
    // Кнопка до выбора уровня неактивна
    document.getElementById('start-button')?.click();
    // Проверяем, что не нажалась

    expect(app.renderScreen).not.toBeCalled();

    const levels: string[] = Object.keys(gameLogic.LEVELS);
    const labelNumbers: number[] = [
      1, 2, 3, 1, 2, 3, 2, 1, 3, 2
    ];

    // Проверяем, что выбирается правильный уровень сложности
    for (const i of labelNumbers) {
      document.getElementById('l' + i)?.click();
      expect(app.state.choosedLevel).toBe(levels[i - 1]);
    }
  });

  test('Choose all levels and cards table displayed correctly', () => {
    const app = initApp();

    // Чтобы успели проверить, что изначально карты открыты
    jest.advanceTimersByTime(1000);

    // Тестируем каждый уровень отдельно
    Object.keys(gameLogic.LEVELS).forEach((level: string, i: number) => {
      // Начинаем игру
      document.getElementById('l' + (i + 1))?.click();
      document.getElementById('start-button')?.click();

      const { height, width } = gameLogic.CARDS_TABLE_SIZE[level];
      const cardsTable = document.getElementsByClassName('cards-field')[0] as HTMLTableElement | null;

      // Таблица отрисовалась
      expect(cardsTable).not.toBeFalsy()
      if (!cardsTable) {
        return;
      }

      // Высота таблицы корректная
      expect(cardsTable.children.length).toBe(height);

      for (let i = 0; i < cardsTable.children.length; i++) {
        const tableRow = cardsTable.children[i] as HTMLTableRowElement | null;

        // Ширина каждой строки корректная
        expect(tableRow?.children.length).toBe(width);
        if (!tableRow?.children) {
          return;
        }

        for (let j = 0; j < tableRow?.children.length; j++) {
          const tableCell = tableRow?.children[i] as HTMLTableCellElement | null;

          // В каждой ячейке лежит изображение
          expect(tableCell?.children.length).not.toEqual(0);
          if (!tableRow?.children) {
            return;
          }

          // Карты есть и они открыты
          const image = tableCell?.children[0] as HTMLImageElement | undefined;
          expect(image?.tagName).toBe('IMG');
          expect(image?.getAttribute('src')).not.toBe(gameLogic.CARD_SHIRT_SRC);
        }
      }

      // Пропускаем задержку таймеров
      jest.advanceTimersByTime(1);
      jest.runOnlyPendingTimers();

      // Карты должны закрыться
      const images = cardsTable.getElementsByTagName('IMG');
      for (let i = 0; i < images.length; i++) {
        const image = images[i] as HTMLImageElement | undefined;
        expect(image?.getAttribute('src')).toBe(gameLogic.CARD_SHIRT_SRC);
      }

      // Начинаем уровень заново
      const againButton = document.getElementsByClassName('again-button')[0] as HTMLButtonElement;
      againButton.click();
    });
  })

  test('Choose any level and timers work correctly', () => {
    // Предопределяем сгенерированные карты для первого уровня
    jest.spyOn(gameLogic, 'generateCards').mockReturnValue(generatedCards);
    jest.spyOn(global, 'setInterval');

    const app = initApp();

    // Начинаем первый уровень
    document.getElementById('l1')?.click();
    document.getElementById('start-button')?.click();

    // Пропускаем задержку таймеров
    jest.runOnlyPendingTimers();

    // Увеличиваем таймер
    app.state.timer.minutes.innerText = '02';
    app.state.timer.seconds.innerText = '37';

    // Проигрываем
    app.renderPopup('lost');

    expect(document.getElementsByClassName('popup')).not.toBeFalsy();

    // Убрали id таймера из состояния
    expect(app.state.timer.id).toBeNull();

    // Проверяем, что был вызван запуск таймера игры
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    // Таймер в попапе совпадает с временем окончания
    expect(document.getElementById('end-timer-minutes')?.innerText).toBe(app.state.timer.minutes.innerText);
    expect(document.getElementById('end-timer-seconds')?.innerText).toBe(app.state.timer.seconds.innerText);
  });
})

describe('E2E tests', () => {
  test('Choose any level and lose and show lose popup correct', () => {
    // Предопределяем сгенерированные карты для первого уровня
    jest.spyOn(gameLogic, 'generateCards').mockReturnValue(generatedCards);
    jest.spyOn(global, 'setInterval');

    const app = initApp();

    // Начинаем первый уровень
    document.getElementById('l1')?.click();
    document.getElementById('start-button')?.click();

    // Пропускаем задержку таймеров
    jest.runOnlyPendingTimers();

    // Проигрываем
    app.renderPopup('lost');

    expect(document.getElementsByClassName('popup')).not.toBeFalsy();

    // Получаем данные из попапа проигрыша
    const popup = document.getElementsByClassName('popup-container')[0] as HTMLDivElement | undefined;
    expect(popup).not.toBeUndefined();
    const title = popup?.getElementsByClassName('title')[0] as HTMLHeadingElement | undefined;
    expect(title?.innerHTML).toBe('Вы проиграли!');
  });

  let g = 0;
  test('Choose any level and win and show win popup correct', () => {
    // Предопределяем сгенерированные карты для первого уровня
    jest.spyOn(gameLogic, 'generateCards').mockReturnValue(generatedCards);
    jest.spyOn(global, 'setInterval');

    const app = initApp();

    // Начинаем первый уровень
    document.getElementById('l1')?.click();
    document.getElementById('start-button')?.click();

    // Пропускаем задержку таймеров
    jest.runOnlyPendingTimers();

    // Выигрываем
    app.renderPopup('win');

    expect(document.getElementsByClassName('popup')).not.toBeFalsy();

    console.log(app.state.cardUrls);
    console.log(document.body.innerHTML);

    // Получаем данные из попапа выигрыша
    const popup = document.getElementsByClassName('popup-container')[0] as HTMLDivElement | undefined;
    expect(popup).not.toBeUndefined();
    const title = popup?.getElementsByClassName('title')[0] as HTMLHeadingElement | undefined;
    expect(title?.innerHTML).toBe('Вы выиграли!');
  });
});
