import Cards from '@components/cards.js';
import Sort, {SortType} from '@components/sort.js';
import Message from '@components/message.js';
import MoreButton from '@components/moreButton.js';
import {render, RenderPosition, remove} from '@src/utils/render.js';
import CardController, {Mode as CardControllerMode, EmptyTask} from '@src/controllers/card.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderCards = (cardListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange, onViewChange);

    // cardController.render(card);
    cardController.render(card, CardControllerMode.DEFAULT);

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
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_TASKS_COUNT_ON_START;
    this._sortComponent = new Sort();
    this._messageComponent = new Message();
    this._cardsComponent = new Cards();
    this._moreButtonComponent = new MoreButton();
    this._creatingCard = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();

    const cards = this._cardsModel.getCards();
    const isAllTasksArchived = cards.every((card) => card.isArchive);

    if (isAllTasksArchived) {
      render(container, this._messageComponent, RenderPosition.BEFOREEND);
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._cardsComponent, RenderPosition.BEFOREEND);

    this._renderCards(cards.slice(0, this._showingCardCount));

    this._renderLoadMoreButton();
  }

  createTask() {
    if (this._creatingCard) {
      return;
    }

    const cardListElement = this._cardsComponent.getElement();
    this._creatingCard = new CardController(cardListElement, this._onDataChange, this._onViewChange);
    this._creatingCard.render(EmptyTask, CardControllerMode.ADDING);
  }

  _removeTasks() {
    this._showedCardControllers.forEach((taskController) => taskController.destroy());
    this._showedCardControllers = [];
  }

  _renderCards() {
    const cardListElement = this._cardsComponent.getElement();

    // const newCards = renderCards(cardListElement, this._cards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    const newCards = renderCards(cardListElement, cards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    this._showingCardsCount = this._showedCardControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingCardsCount >= this._cardsModel.getCards().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._moreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onDataChange(cardController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        cardController.destroy();
        this._updateCards(this._showingCardsCount);
      } else {
        this._cardsModel.addCard(newData);
        cardController.render(newData, CardControllerMode.DEFAULT);

        if (this._showingCardsCount % SHOWING_TASKS_COUNT_BY_BUTTON === 0) {
          const destroyedCard = this._showedCardControllers.pop();
          destroyedCard.destroy();
        }

        this._showedCardControllers = [].concat(cardController, this._showedCardControllers);
        this._showingCardsCount = this._showedCardControllers.length;

        this._renderLoadMoreButton();
      }
    } else if (newData === null) {
      this._cardsModel.removeCard(oldData.id);
      this._updateCards(this._showingCardsCount);
    } else {
      const isSuccess = this._tasksModel.updateCard(oldData.id, newData);

      if (isSuccess) {
        CardController.render(newData, CardControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingCardsCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(this._cardsModel.getCards(), sortType, 0, this._showingCardsCount);


    this._removeCards();
    this._renderCards(sortedCards);

    this._renderLoadMoreButton();
  }

  _onLoadMoreButtonClick() {
    const prevCardsCount = this._showingCardsCount;
    const cards = this._cardsModel.getCards();

    this._showingCardsCount = this._showingCardsCount + SHOWING_TASKS_COUNT_BY_BUTTON;
    const sortedCards = getSortedCards(cards, this._sortComponent.getSortType(), prevCardsCount, this._showingCardsCount);
    this._renderCards(sortedCards);

    if (this._showingCardsCount >= sortedCards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }
}
