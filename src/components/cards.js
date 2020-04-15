import Card from '@components/card.js';
import Form from '@components/form.js';
import MoreButton from '@components/moreButton.js';
import {render, RenderPosition, createElement} from '@components/utils.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const createTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Cards {
  constructor(data) {
    this._data = data;
    this._element = null;
    this._form = null;
    this._moreButton = null;
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  }

  init() {
    this._form = new Form(this._data[0]);
    render(this._element, this._form.getElement(), RenderPosition.BEFOREEND);
    this.renderCards(this._data.slice(1, this._showingTasksCount));

    this._moreButton = new MoreButton();
    render(this._element.parentNode, this._moreButton.getElement(), RenderPosition.BEFOREEND);
    this._moreButton._element.addEventListener(`click`, () => {
      this.showMoreCards();
    });
  }

  getTemplate() {
    return createTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  renderCards(data) {
    data.forEach((it) => {
      const card = new Card(it);

      render(this._element, card.getElement(), RenderPosition.BEFOREEND);
    });
  }

  showMoreCards() {
    const prevTasksCount = this._showingTasksCount;
    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this.renderCards(this._data.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= this._data.length) {
      this._moreButton.hide();
    }
  }
}
