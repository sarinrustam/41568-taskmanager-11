import Card from '@components/card.js';
import Form from '@components/form.js';
import {render, replace, RenderPosition} from '@src/utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._cardComponent = null;
    this._formComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldFormComponent = this._formComponent;

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

    // render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    if (oldFormComponent && oldCardComponent) {
      replace(this._taskComponent, oldCardComponent);
      replace(this._taskEditComponent, oldFormComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceFormToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._formComponent.reset();
    replace(this._cardComponent, this._formComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToForm() {
    this._onViewChange();
    replace(this._formComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
