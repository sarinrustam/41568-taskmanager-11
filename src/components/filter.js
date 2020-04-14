import {render} from '@components/utils.js';

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

const renderFilter = function (filters, container) {
  const filterMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  const createTemplate = () => {
    return (
      `<section class="main__filter filter container">
        ${filterMarkup}
      </section>`
    );
  };
  render(container, createTemplate(), `beforeend`);
};

export {renderFilter};
