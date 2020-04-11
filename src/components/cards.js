import {renderCard} from '@components/card.js';
import {renderForm} from '@components/form.js';
import {renderMoreButton, initMoreButton} from '@components/moreButton.js';
import {render} from '@components/utils.js';
import {hideMoreButton} from '@components/moreButton.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;
let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
let cards;
let cardContainer;

const renderCards = function (data) {
  const cardsTemplate = data.reduce((prev, task) => prev + renderCard(task), ``);

  render(cardContainer, cardsTemplate, `beforeend`);
};

const initCards = function (data, siteMain) {
  cards = data;
  const boardElement = siteMain.querySelector(`.board`);
  cardContainer = siteMain.querySelector(`.board__tasks`);

  renderForm(cards[0], cardContainer);
  renderCards(cards.slice(1, showingTasksCount));

  renderMoreButton(boardElement);
  initMoreButton(boardElement, showingTasksCount);
};

const showMoreCards = function () {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  renderCards(cards.slice(prevTasksCount, showingTasksCount));

  if (showingTasksCount >= cards.length) {
    hideMoreButton();
  }
};

export {initCards, showMoreCards};
