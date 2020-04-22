
import {MONTH_NAMES} from '@components/constants.js';
import {formatTime} from '@src/utils/common.js';
import AbstractComponent from '@components/abstract-component.js';

const createTemplate = function (data) {
  const {description, dueDate, color, repeatingDays, isArchive, isFavorite} = data;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const repeatingClass = Object.values(repeatingDays).some((x) => x) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const disabledAchiveClass = isArchive ? `` : `card__btn--disabled`;
  const disabledFavoriteClass = isFavorite ? `` : `card__btn--disabled`;

  return (
    `<article class="card card--${color} ${repeatingClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${disabledAchiveClass}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${disabledFavoriteClass}"
            >
              favorites
            </button>
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
    </article>`
  );
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
}