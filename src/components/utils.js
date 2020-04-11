const getRandomNumber = function () {
  return Math.floor(Math.random() * 10);
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : value.toString();
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
