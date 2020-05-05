
import Menu, {MenuItem} from '@components/menu.js';
import FilterController from '@controllers/filter.js';
import Board from '@components/board.js';
// import {generateFilters} from '@components/mock/filter.js';
import {generateCards} from '@components/mock/card.js';
import {render, RenderPosition} from '@src/utils/render.js';
import BoardController from '@src/controllers/board.js';
import CardsModel from '@src/models/cardsModel.js';

const init = function () {
  const cardsData = generateCards();
  const cardsModel = new CardsModel();
  cardsModel.setCards(cardsData);

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  const menu = new Menu();
  render(siteMainSection, menu, RenderPosition.BEFOREEND);


  const board = new Board();
  render(siteMain, board, RenderPosition.BEFOREEND);

  const filterController = new FilterController(siteMainSection, cardsModel);
  filterController.render();

  const boardController = new BoardController(board, cardsModel);

  boardController.render(cardsData);

  menu.setOnChange((menuItem) => {
    switch (menuItem) {
      case MenuItem.NEW_TASK:
        menu.setActiveItem(MenuItem.TASKS);
        boardController.createCard();
        break;
    }
  });
};

init();
