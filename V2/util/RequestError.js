import { getReasonPhrase, StatusCodes } from "http-status-codes";

export default class RequestError extends Error {
  constructor(statusCode = StatusCodes.BAD_REQUEST, message = null) {
    super(message ?? getReasonPhrase(statusCode));

    this.statusCode = statusCode;
  }
}
