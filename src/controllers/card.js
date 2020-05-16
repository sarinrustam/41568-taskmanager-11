import Card from '@components/card.js';
import CardModel from '@src/models/card.js';
import Form from '@components/form.js';
import {render, replace, remove, RenderPosition} from '@src/utils/render.js';
import {COLOR, DAYS} from '@src/const.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new CardModel({
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "color": formData.get(`color`),
    "is_favorite": false,
    "is_done": false,
  });
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
      const newCard = CardModel.clone(card);
      newCard.isArchive = !newCard.isArchive;

      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setFavoritesButtonClickHandler(() => {
      const newCard = CardModel.clone(card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(this, card, newCard);
    });

    this._formComponent.setSubmitHandler(() => {
      const formData = this._formComponent.getData();
      const data = parseFormData(formData);

      this._formComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, card, data);
    });
    this._formComponent.setDeleteButtonClickHandler(() => {
      this._formComponent.setData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, card, null);
    });

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

  shake() {
    this._formComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._cardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._formComponent.getElement().style.animation = ``;
      this._cardComponent.getElement().style.animation = ``;

      this._formComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceFormToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._formComponent.reset();
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
