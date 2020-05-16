import Card from '@src/models/card.js';

const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const CodesErrors = {
  200: `200`,
  300: `300`,
};

const checkStatus = (response) => {
  if (response.status >= CodesErrors[200] && response.status < CodesErrors[300]) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: `tasks`})
      .then((response) => response.json())
      .then(Card.parseCards);
  }

  updateCard(id, data) {
    return this._load({
      url: `tasks/${id}`,
      method: Methods.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseCard);
  }

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  createCard(card) {
    return this._load({
      url: `tasks`,
      method: Methods.POST,
      body: JSON.stringify(card.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseCard);
  }

  deleteCard(id) {
    return this._load({url: `tasks/${id}`, method: Methods.DELETE});
  }
}
