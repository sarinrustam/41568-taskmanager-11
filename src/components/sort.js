import {render} from '@components/utils.js';

const renderSort = function (container) {
  const createTemplate = () => {
    return (
      `<section class="board container">
        <div class="board__filter-list">
          <a href="#" class="board__filter">SORT BY DEFAULT</a>
          <a href="#" class="board__filter">SORT BY DATE up</a>
          <a href="#" class="board__filter">SORT BY DATE down</a>
        </div>

        <div class="board__tasks"></div>
      </section>`
    );
  };
  render(container, createTemplate(), `beforeend`);
};

export {renderSort};
