
import Menu, {MenuItem} from '@components/menu.js';
import FilterController from '@src/controllers/filter.js';
import Board from '@components/board.js';
// import {generateFilters} from '@components/mock/filter.js';
import {generateCards} from '@components/mock/card.js';
import {render, RenderPosition} from '@src/utils/render.js';
import BoardController from '@src/controllers/board.js';
import CardsModel from '@src/models/cardsModel.js';
import Statistics from '@components/statistics.js';

const init = function () {
  const cardsData = generateCards();
  const cardsModel = new CardsModel();
  cardsModel.setCards(cardsData);

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  const menu = new Menu();
  render(siteMainSection, menu, RenderPosition.BEFOREEND);

  const filterController = new FilterController(siteMain, cardsModel);
  filterController.render();

  const board = new Board();
  render(siteMain, board, RenderPosition.BEFOREEND);

  const boardController = new BoardController(board, cardsModel);

  boardController.render(cardsData);

  const dateTo = new Date();
  const dateFrom = (() => {
    const d = new Date(dateTo);
    d.setDate(d.getDate() - 7);
    return d;
  })();
  const statisticsComponent = new Statistics({tasks: cardsModel, dateFrom, dateTo});
  render(siteMainSection, statisticsComponent, RenderPosition.BEFOREEND);
  statisticsComponent.hide();

  menu.setOnChange((menuItem) => {
    switch (menuItem) {
      case MenuItem.NEW_TASK:
        menu.setActiveItem(MenuItem.TASKS);
        statisticsComponent.hide();
        boardController.show();
        boardController.createCard();
        break;
      case MenuItem.STATISTICS:
        boardController.hide();
        statisticsComponent.show();
        break;
      case MenuItem.TASKS:
        statisticsComponent.hide();
        boardController.show();
        break;
    }
  });
};

init();
