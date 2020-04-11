
import {renderMenu} from '@components/menu.js';
import {renderFilter} from '@components/filter.js';
import {renderSort} from '@components/sort.js';
import {initCards} from '@components/cards.js';
import {generateFilters} from '@components/mock/filter.js';
import {generateCards} from '@components/mock/card.js';

const init = function () {
  const TASK_COUNT = 22;

  const filters = generateFilters();
  const cards = generateCards(TASK_COUNT);

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  renderMenu(siteMainSection);
  renderFilter(filters, siteMain);
  renderSort(siteMain);
  initCards(cards, siteMain);
};

init();
