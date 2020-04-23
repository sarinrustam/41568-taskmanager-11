import Cards from '@components/cards.js';
import Sort, {SortType} from '@components/sort.js';
import Message from '@components/message.js';
import Card from '@components/card.js';
import Form from '@components/form.js';
import MoreButton from '@components/moreButton.js';
import {render, RenderPosition, replace, remove} from '@src/utils/render.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderCard = (container, data) => {
  const replaceCardToForm = () => {
    replace(form, card);
  };

  const replaceFormToCard = () => {
    replace(card, form);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const card = new Card(data);
  const form = new Form(data);

  card.setEditButtonClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  form.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, card, RenderPosition.BEFOREEND);
};

const renderCards = (cardListElement, cards) => {
  cards.forEach((card) => {
    renderCard(cardListElement, card);
  });
};

const getSortedCards = (cards, sortType, from, to) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedCards = showingCards.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedCards = showingCards.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedCards = showingCards;
      break;
  }

  return sortedCards.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._sort = new Sort();
    this._message = new Message();
    this._cards = new Cards();
    this._moreButton = new MoreButton();
  }

  _renderContainer(cards) {
    const container = this._container.getElement();

    const isAllTasksArchived = cards.every((card) => card.isArchive);

    if (isAllTasksArchived) {
      render(container, this._message, RenderPosition.BEFOREEND);
    }

    render(container, this._sort, RenderPosition.BEFOREEND);
    render(container, this._cards, RenderPosition.BEFOREEND);
  }

  _renderContent(cards) {
    const container = this._container.getElement();
    const cardListElement = this._cards.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const renderLoadMoreButton = () => {
      if (showingTasksCount >= cards.length) {
        return;
      }

      render(container, this._moreButton, RenderPosition.BEFOREEND);

      this._moreButton.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
        const sortedCards = getSortedCards(cards, this._sort.getSortType(), prevTasksCount, showingTasksCount);

        renderCards(cardListElement, sortedCards);

        if (showingTasksCount >= cards.length) {
          remove(this._moreButton);
        }
      });
    };

    renderCards(cardListElement, cards.slice(0, showingTasksCount));

    renderLoadMoreButton();

    this._sort.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedCards = getSortedCards(cards, sortType, 0, showingTasksCount);

      cardListElement.innerHTML = ``;

      renderCards(cardListElement, sortedCards);

      renderLoadMoreButton();
    });
  }

  render(cards) {
    this._renderContainer(cards);
    this._renderContent(cards);
  }
}
