const CAST_FORMAT_NUMBER = 10;
const MULTIPLIER = 10;

export const Buttons = {
  LMB: 0,
  ENT: `Enter`,
  ESC: `Escape`,
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const getRandomNumber = function () {
  return Math.floor(Math.random() * MULTIPLIER);
};

export const castTimeFormat = (value) => {
  return value < CAST_FORMAT_NUMBER ? `0${value}` : value.toString();
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const createElement = (template) => {
  const element = document.createElement(`div`);

  element.innerHTML = template;

  return element.firstChild;
};

export const render = function (container, element, place) {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
