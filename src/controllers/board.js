import Cards from '@components/cards.js';
import Sort, {SortType} from '@components/sort.js';
import Message from '@components/message.js';
import MoreButton from '@components/moreButton.js';
import {render, RenderPosition, remove} from '@src/utils/render.js';
import CardController from '@components/controllers/card.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderCards = (cardListElement, cards, onDataChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange);

    cardController.render(card);

    return cardController;
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

    this._cards = [];
    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortComponent = new Sort();
    this._messageComponent = new Message();
    this._cardsComponent = new Cards();
    this._moreButtonComponent = new MoreButton();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderContainer(cards) {
    this._cards = cards;

    const container = this._container.getElement();

    const isAllTasksArchived = this._cards.every((card) => card.isArchive);

    if (isAllTasksArchived) {
      render(container, this._messageComponent, RenderPosition.BEFOREEND);
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._cardsComponent, RenderPosition.BEFOREEND);
  }

  _renderContent(cards) {
    const cardListElement = this._cardsComponent.getElement();

    const newCards = renderCards(cardListElement, this._cards.slice(0, this._showingCardsCount), this._onDataChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    this._renderLoadMoreButton();
  }

  render(cards) {
    this._renderContainer(cards);
    this._renderContent(cards);
  }

  _renderLoadMoreButton() {
    if (this._showingCardsCount >= this._cards.length) {
      return;
    }
    const container = this._container.getElement();
    render(container, this._moreButtonComponent, RenderPosition.BEFOREEND);

    this._moreButtonComponent.setClickHandler(() => {
      const prevCardsCount = this._showingCardsCount;

      const cardListElement = this._cardsComponent.getElement();

      this._showingCardsCount = this._showingCardsCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedCards = getSortedCards(this._cards, this._sortComponent.getSortType(), prevCardsCount, this._showingCardsCount);
      const newCards = renderCards(cardListElement, sortedCards, this._onDataChange);

      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (this._showingCardsCount >= this._cards.length) {
        remove(this._moreButtonComponent);
      }
    });
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    cardController.render(this._cards[index]);
  }

  _onSortTypeChange() {
    this._showingCardsCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(this._cards, sortType, 0, this._showingCardsCount);
    const cardListElement = this._cardsComponent.getElement();

    cardListElement.innerHTML = ``;

    const newCards = renderCards(cardListElement, sortedCards, this._onDataChange);
    this._showedCardControllers = newCards;

    renderLoadMoreButton();
  }
}
