const { v4: uuidv4 } = require('uuid');

class TicketFull {
  constructor(name, description ) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.status = false;
    this.created = new Date().toLocaleString()
  }
}

module.exports = TicketFull;
