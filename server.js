const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const TicketController = require('./api/TicketController');
const tickets = require('./api/tickets');
const ticketCtlr = new TicketController(tickets);

const port = process.env.PORT || 3000;


app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = { 'Access-Control-Allow-Origin': '*', };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204; // No content
  }
});

app.use(async (ctx) => {
  const { method, id } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      try {
        const result = ticketCtlr.getAllTickets();
        ctx.response.body = result;
      }
      catch (err) {
        console.error(err);
        ctx.status = 500;
        ctx.response.body = 'Internal error. Method "allTickets"';
      }
      return;
    case 'ticketById':
      try {
        const result = ticketCtlr.getTicketById(id);
        ctx.response.body = result;
      }
      catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.response.body = `${err.message}. Method "ticketById"`;
      }
      return;
    case 'createTicket':
      try {
        console.log(JSON.parse(ctx.request.body))
        const { name, description } = JSON.parse(ctx.request.body);
        const result = ticketCtlr.createTicket(name, description);
        ctx.response.body = result;
      }
      catch (err) {
        console.error(err);
        ctx.status = 500;
        ctx.response.body = 'Internal error. Method "createTicket"';
      }
      return;
    case 'editTicket':
      try {
        console.log(JSON.parse(ctx.request.body))
        const { id, name, description, status } = JSON.parse(ctx.request.body);
        const result = ticketCtlr.editTicket(id, name, description, status);
        ctx.response.body = result;
      }
      catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.response.body = `${err.message}. Method "editTicket"`;
      }
      return;
    case 'deleteTicket':
      try {
        const result = ticketCtlr.deleteTicket(id);
        ctx.response.body = { success: result };
      }
      catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.response.body = err.message;
      }
      return;

    default:
      ctx.response.body = `Method "${method}" is not known.`;
      ctx.response.status = 404;
      return;
  }
})

exports.start = async () => {
  try {
    app.listen(port, () => {
      console.log(`The server is running on port ${port}`);
      console.log('Heroku:', 'https://ahj-7-1helpdesk.herokuapp.com/');
    })
  }
  catch (err) {
    console.log(err);
  }
}
