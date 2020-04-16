import {createElement} from '@components/utils.js';

const createTemplate = (text) => {
  return (
    `<p class="board__no-tasks">${text}</p>`
  );
};

export default class Message {
  constructor(text) {
    this._text = text;
    this._element = null;
  }

  getTemplate() {
    return createTemplate(this._text);
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
}
