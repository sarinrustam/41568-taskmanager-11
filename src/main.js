
import {renderMenu} from '@components/menu.js';
import {renderFilter} from '@components/filter.js';
import {renderSort} from '@components/sort.js';
import {renderCard} from '@components/card.js';
import {renderForm} from '@components/form.js';
import {renderMoreButton} from '@components/moreButton.js';

const init = function () {
  const TASK_COUNT = 3;

  const siteMain = document.querySelector(`.main`);
  const siteMainSection = siteMain.querySelector(`.main__control`);

  renderMenu(siteMainSection);
  renderFilter(siteMain);
  renderSort(siteMain);

  const taskList = siteMain.querySelector(`.board__tasks`);
  const boardElement = siteMain.querySelector(`.board`);

  renderForm(taskList);

  for (let i = 0; i < TASK_COUNT; i++) {
    renderCard(taskList);
  }

  renderMoreButton(boardElement);
};

init();
