// Game model placeholder
// Represents board games in the system

class Game {
  constructor(id, title, description, isAvailable) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isAvailable = isAvailable;
  }
}

module.exports = Game;
