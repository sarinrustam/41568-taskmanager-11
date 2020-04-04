import {render} from '@components/utils.js';

const renderMoreButton = function (container) {
  const createTemplate = () => {
    return (
      `<button class="load-more" type="button">load more</button>`
    );
  };
  render(container, createTemplate(), `beforeend`);
};

export {renderMoreButton};
