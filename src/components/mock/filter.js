import {getRandomNumber} from '@components/utils.js';

const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: getRandomNumber(),
    };
  });
};

export {generateFilters};
