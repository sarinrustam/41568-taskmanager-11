import {getRandomNumber} from '@components/utils.js';

const FILTER_NAMES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: getRandomNumber(),
    };
  });
};

export {generateFilters};
