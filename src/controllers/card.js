import Card from '@components/card.js';
import Form from '@components/form.js';
import {render, replace, RenderPosition} from '@src/utils/render.js';

export default class CardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._cardComponent = null;
    this._formComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    this._cardComponent = new Card(card);
    this._formComponent = new Form(card);

    this._card.setEditButtonClickHandler(() => {
      this._replaceCardToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isArchive: !card.isArchive,
      }));
    });

    this._cardComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    this._formComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormToCard();
    });

    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _replaceFormToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._cardComponent, this._formComponent);
  }

  _replaceCardToForm() {
    replace(this._formComponent, this._cardComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
