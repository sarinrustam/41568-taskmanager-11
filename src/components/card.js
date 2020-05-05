import {formatTime, formatDate} from '@src/utils/common.js';
import AbstractComponent from '@components/abstract-component.js';
import {isOverdueDate} from '@src/utils/common.js';
import {encode} from "he";

const createButtonMarkup = (name, isActive = true) => {
  return (
    `<button
      type="button"
      class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
      ${name}
    </button>`
  );
};

const createTemplate = function (data) {
  const {description: notSanitizedDescription, dueDate, color, repeatingDays} = data;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;
  const description = encode(notSanitizedDescription);

  const editButton = createButtonMarkup(`edit`);
  const archiveButton = createButtonMarkup(`archive`, !data.isArchive);
  const favoritesButton = createButtonMarkup(`favorites`, !data.isFavorite);

  const repeatingClass = Object.values(repeatingDays).some((x) => x) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return (
    `<article class="card card--${color} ${repeatingClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoritesButton}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`);
};

export default class Card extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  setEditButtonClickHandler(handler) {
    const edit = this.getElement().querySelector(`.card__btn--edit`);

    edit.addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    const favorite = this.getElement().querySelector(`.card__btn--favorites`);

    favorite.addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    const archive = this.getElement().querySelector(`.card__btn--archive`);

    archive.addEventListener(`click`, handler);
  }
}
