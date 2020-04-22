
import Menu from '@components/menu.js';
import Filter from '@components/filter.js';
import Board from '@components/board.js';
import {generateFilters} from '@components/mock/filter.js';
import {generateCards} from '@components/mock/card.js';
import {render, RenderPosition} from '@src/utils/render.js';
import BoardController from '@src/controllers/board.js';

const init = function () {
  const filters = generateFilters();
  const cardsData = generateCards();

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  const board = new Board();
  const menu = new Menu();
  const filter = new Filter(filters);
  
  render(siteMainSection, menu, RenderPosition.BEFOREEND);
  render(siteMain, filter, RenderPosition.BEFOREEND);
  render(siteMain, board, RenderPosition.BEFOREEND);

  const boardController = new BoardController(board);

  boardController.render(cardsData);
};

init();
