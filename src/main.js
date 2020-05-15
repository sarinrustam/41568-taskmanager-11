
import API from '@src/api.js';
import Board from '@components/board.js';
import BoardController from '@src/controllers/board.js';
import CardsModel from '@src/models/cardsModel.js';
import FilterController from '@src/controllers/filter.js';
import Menu, {MenuItem} from '@components/menu.js';
import Statistics from '@components/statistics.js';

import {render, RenderPosition} from '@src/utils/render.js';

const AUTHORIZATION = `Basic AsdfDSGSdgdsgdsgs=`;

const init = function () {
  const dateTo = new Date();
  const dateFrom = (() => {
    const d = new Date(dateTo);
    d.setDate(d.getDate() - 7);
    return d;
  })();

  const api = new API(AUTHORIZATION);
  const cardsModel = new CardsModel();

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  const menu = new Menu();
  const statisticsComponent = new Statistics({tasks: cardsModel, dateFrom, dateTo});
  const board = new Board();
  const boardController = new BoardController(board, cardsModel);
  const filterController = new FilterController(siteMain, cardsModel);

  render(siteMainSection, menu, RenderPosition.BEFOREEND);
  filterController.render();
  render(siteMain, board, RenderPosition.BEFOREEND);
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

  api.getCards()
    .then((cards) => {
      cardsModel.setCards(cards);
      boardController.render();
    });
};

init();
