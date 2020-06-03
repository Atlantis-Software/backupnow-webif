export default class LogService {
  constructor() {

  }

  info(err) {
    console.log(err);
  }

  error(err) {
    console.error(err);
  }
}

LogService.parameters = [];

