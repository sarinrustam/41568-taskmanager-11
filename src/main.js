
import Menu from '@components/menu.js';
import Filter from '@components/filter.js';
import Sort from '@components/sort.js';
import Board from '@components/board.js';
import Cards from '@components/cards.js';
import Message from '@components/message.js';
import {generateFilters} from '@components/mock/filter.js';
import {generateCards} from '@components/mock/card.js';
import {render, RenderPosition} from '@components/utils.js';

const init = function () {
  const filters = generateFilters();
  const cardsData = generateCards();

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  const board = new Board();
  const menu = new Menu();
  const filter = new Filter(filters);

  render(siteMainSection, menu.getElement(), RenderPosition.BEFOREEND);
  render(siteMain, filter.getElement(), RenderPosition.BEFOREEND);
  render(siteMain, board.getElement(), RenderPosition.BEFOREEND);

  if (cardsData.length) {
    const sort = new Sort();
    const cards = new Cards(cardsData);

    render(board._element, sort.getElement(), RenderPosition.BEFOREEND);
    render(board._element, cards.getElement(), RenderPosition.BEFOREEND);

    cards.init();
  } else {
    const message = new Message(`Click «ADD NEW TASK» in menu to create your first task`);

    render(board._element, message.getElement(), RenderPosition.BEFOREEND);
  }
};

init();
