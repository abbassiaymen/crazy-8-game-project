// Rental model placeholder
// Tracks board game rentals

class Rental {
  constructor(id, gameId, userId, rentDate, returnDate) {
    this.id = id;
    this.gameId = gameId;
    this.userId = userId;
    this.rentDate = rentDate;
    this.returnDate = returnDate;
  }
}

module.exports = Rental;
