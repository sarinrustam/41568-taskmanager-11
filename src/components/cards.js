import AbstractComponent from '@components/abstract-component.js';
import {render, RenderPosition, replace, remove} from '@src/utils/render.js';

const createTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Cards extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createTemplate();
  }
}