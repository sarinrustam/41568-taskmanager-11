import AbstractComponent from '@components/abstract-component.js';

const createTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class MoreButton extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
