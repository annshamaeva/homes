import {
    App,
    initApp,
    renderCardsGameScreen,
    renderChooseLevelScreen,
    renderLostPopup,
    renderWinPopup
} from "./gameLogic";

export const app: App = initApp(
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
