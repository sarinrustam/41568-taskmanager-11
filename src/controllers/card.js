import Card from '@components/card.js';
import Form from '@components/form.js';
import {render, replace, RenderPosition} from '@src/utils/render.js';

export default class CardController {
  constructor(container) {
    this._container = container;

    this._card = null;
    this._form = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    this._card = new Card(card);
    this._form = new Form(card);

    this._card.setEditButtonClickHandler(() => {
      this._replaceCardToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._form.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormToCard();
    });

    render(this._container, this._card, RenderPosition.BEFOREEND);
  }

  _replaceFormToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._card, this._form);
  }

  _replaceCardToForm() {
    replace(this._form, this._card);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
