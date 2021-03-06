import Card from '@components/card.js';
import Form from '@components/form.js';
import {render, replace, remove, RenderPosition} from '@src/utils/render.js';
import {COLOR} from '@src/const.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
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

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldFormComponent = this._formComponent;
    this._mode = mode;

    this._cardComponent = new Card(card);
    this._formComponent = new Form(card);

    this._cardComponent.setEditButtonClickHandler(() => {
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

    this._formComponent.setSubmitHandler(() => {
      const data = this._formComponent.getData();
      this._onDataChange(this, card, data);
    });
    this._formComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, card, null));

    // render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    // if (oldFormComponent && oldCardComponent) {
    //   replace(this._taskComponent, oldCardComponent);
    //   replace(this._taskEditComponent, oldFormComponent);
    //   this._replaceFormToCard();
    // } else {
    //   render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    // }
    switch (mode) {
      case Mode.DEFAULT:
        if (oldFormComponent && oldCardComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._formComponent, oldFormComponent);
          this._replaceFormToCard();
        } else {
          render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldFormComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldFormComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._formComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  destroy() {
    remove(this._formComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._formComponent.reset();
    // replace(this._cardComponent, this._formComponent);
    if (document.contains(this._formComponent.getElement())) {
      replace(this._cardComponent, this._formComponent);
    }
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
