import Card from '@src/models/card.js';

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getCards() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
      .then((response) => response.json())
      .then(Card.parseCards);
  }
}