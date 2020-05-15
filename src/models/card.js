export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.description = data[`description`] || ``;
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isArchive = Boolean(data[`is_archived`]);
  }

  static parseCard(data) {
    return new Card(data);
  }

  static parseCards(data) {
    return data.map(Card.parseCard);
  }
}
