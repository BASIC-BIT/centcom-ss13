export default class ApiGatewayEventParser {
  constructor(event, context) {
    this.event = event;
    this.context = context;
  }

  getHeaders() {
    return this.event.headers;
  }

  getMethod() {
    return this.event.httpMethod;
  }

  getPath() {
    return this.event.path;
  }

  regexTestPath(regex) {
    return regex.test(this.event.path);
  }

  regexMatchPath(regex) {
    return this.event.path.match(regex);
  }

  getEvent() {
    return this.event;
  }

  getContext() {
    return this.context;
  }

  getBody() {
    console.log(this.event.body);
    return this.event.body;
  }
}