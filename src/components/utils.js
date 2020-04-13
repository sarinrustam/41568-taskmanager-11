const CAST_FORMAT_NUMBER = 10;
const MULTIPLIER = 10;

const getRandomNumber = function () {
  return Math.floor(Math.random() * MULTIPLIER);
};

const castTimeFormat = (value) => {
  return value < CAST_FORMAT_NUMBER ? `0${value}` : value.toString();
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

const render = (container, template, targetPlace) => {
  container.insertAdjacentHTML(targetPlace, template);
};

export {formatTime, render, getRandomNumber};
