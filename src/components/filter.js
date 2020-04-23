import AbstractComponent from '@components/abstract-component.js';

const createTemplate = function (data) {
  const createFilterMarkup = (filter, isChecked) => {
    const {name, count} = filter;
    return (
      `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${name}" class="filter__label">${name}<span class="filter__${name}-count"> ${count}</span></label
    >`
    );
  };

  const filterMarkup = data.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filterMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createTemplate(this._data);
  }
}
