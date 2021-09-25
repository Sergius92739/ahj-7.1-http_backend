const Ticket = require("./Ticket");
const TicketFull = require("./TicketFull");

class TicketController {
  constructor(data) {
    this.data = data;
    this.formatter = null;
  }

  getAllTickets() {
    const short = this.data.map((e) => new Ticket(e));
    return short;
  }

  getTicketById(id) {
    if (this.data.some((e) => e.id === id)) {
      return this.data.find((e) => e.id === id);
    }
    throw new Error('Invalid ID');
  }

  createTicket(name, description) {
    const ticket = new TicketFull(name, description)
    this.data.push(ticket);
    return ticket;
  }
  editTicket(id, name, description, status) {
    if (this.getTicketById(id)) {
      const ticket = this.getTicketById(id);
      ticket.name = name;
      ticket.description = description;
      ticket.status = status;
      ticket.created = this.getFormatDate();
      return ticket
    }
  }

  getFormatDate() {
    this.formatter = new Intl.DateTimeFormat("ru", {
      timeZone: "Europe/Moscow",
      day: "numeric",
      year: "numeric",
      month: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
    return this.formatter.format(new Date());
  }

  deleteTicket(id) {
    if (this.getTicketById(id)) {
      const index = this.data.findIndex((e) => e.id === id);
      this.data.splice(index, 1);
      return true;
    }
  }
}

module.exports = TicketController;
