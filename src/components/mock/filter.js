import {getRandomNumber} from '@components/utils.js';

const filterName = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const generateFilters = () => {
  return filterName.map((it) => {
    return {
      name: it,
      count: getRandomNumber(),
    };
  });
};

export {generateFilters};
