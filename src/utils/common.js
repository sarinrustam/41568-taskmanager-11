import moment from 'moment';

const MULTIPLIER = 10;

export const Buttons = {
  LMB: 0,
  ENT: `Enter`,
  ESC: `Escape`,
};

export const getRandomNumber = function () {
  return Math.floor(Math.random() * MULTIPLIER);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
