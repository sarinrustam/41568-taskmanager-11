import {render} from '@components/utils.js';
import {showMoreCards} from '@components/cards.js';

let loadMoreButton;

const renderMoreButton = function (container) {
  const createTemplate = () => {
    return (
      `<button class="load-more" type="button">load more</button>`
    );
  };
  render(container, createTemplate(), `beforeend`);
};

const initMoreButton = function (boardElement) {
  loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, () =>{
    showMoreCards();
  });
};

const hideMoreButton = function () {
  loadMoreButton.remove();
};

export {renderMoreButton, initMoreButton, hideMoreButton};
