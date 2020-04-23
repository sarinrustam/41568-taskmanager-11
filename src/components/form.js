import {formatTime} from '@src/utils/common.js';
import AbstractComponent from '@components/abstract-component.js';
import {MONTH_NAMES, DAYS, COLORS} from '@components/constants.js';

const createTemplate = function (data) {
  const {description, dueDate, color, repeatingDays} = data;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;

  const deadlineClass = isExpired ? `card--deadline` : ``;
  const dateShowToggle = isDateShowing ? `yes` : `no`;
  const deadlineInput = isDateShowing ? `<fieldset class="card__date-deadline">
  <label class="card__input-deadline-wrap">
    <input
      class="card__date"
      type="text"
      placeholder=""
      name="date"
      value="${date} ${time}"
    />
  </label>
</fieldset>` : ``;

  const repeatingShowToggle = isRepeatingTask ? `yes` : `no`;

  const createColorsMarkup = (colors, currentColor) => {
    return colors
      .map((it, index) => {
        return (
          `<input
            type="radio"
            id="color-${it}-${index}"
            class="card__color-input card__color-input--${it} visually-hidden"
            name="color"
            value="${it}"
            ${currentColor === it ? `checked` : ``}
          />
          <label
            for="color-${it}--${index}"
            class="card__color card__color--${it}"
            >${it}</label
          >`
        );
      })
      .join(`\n`);
  };

  const createRepeatingDaysMarkup = (days) => {
    return days
      .map((day, index) => {
        const isChecked = repeatingDays[day];
        return (
          `<input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}-${index}"
            name="repeat"
            value="${day}"
            ${isChecked ? `checked` : ``}
          />
          <label class="card__repeat-day" for="repeat-${day}-${index}"
            >${day}</label
          >`
        );
      })
      .join(`\n`);
  };

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS);

  const repeatingDaysFieldset = isRepeatingTask ? `<fieldset class="card__repeat-days">
  <div class="card__repeat-days-inner">
    ${repeatingDaysMarkup}
  </div>
</fieldset>` : ``;

  return (
    `<article class="card card--edit card--${color} card--${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${dateShowToggle}</span>
              </button>

              ${deadlineInput}

                                <button class="card__repeat-toggle" type="button">
                                repeat:<span class="card__repeat-status">${repeatingShowToggle}</span>
                              </button>

                              ${repeatingDaysFieldset}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class Form extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate(this._data);
  }

  setSubmitHandler(handler) {
    const form = this.getElement().querySelector(`form`);

    form.addEventListener(`submit`, handler);
  }
}
