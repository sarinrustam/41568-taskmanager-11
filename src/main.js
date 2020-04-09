
import {renderMenu} from '@components/menu.js';
import {renderFilter} from '@components/filter.js';
import {renderSort} from '@components/sort.js';
import {renderCard} from '@components/card.js';
import {renderForm} from '@components/form.js';
import {renderMoreButton} from '@components/moreButton.js';
import {generateFilters} from '@components/mock/filter.js';
import {generateCards} from '@components/mock/card.js';

const init = function () {
  const TASK_COUNT = 22;
  const SHOWING_TASKS_COUNT_ON_START = 8;
  const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

  const filters = generateFilters();
  const cards = generateCards(TASK_COUNT);

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  renderMenu(siteMainSection);
  renderFilter(filters, siteMain);
  renderSort(siteMain);

  const taskList = siteMain.querySelector(`.board__tasks`);
  const boardElement = siteMain.querySelector(`.board`);

  renderForm(cards[0], taskList);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  cards.slice(1, showingTasksCount)
    .forEach((task) => renderCard(task, taskList));

  renderMoreButton(boardElement);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, () =>{
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    cards.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderCard(task, taskList));

    if (showingTasksCount >= cards.length) {
      loadMoreButton.remove();
    }
  });
};

init();
