export class JWTException extends Error {
  status: JwtStatus;
  constructor(message: string, status?: JwtStatus) {
    super();
    this.message = message;
    this.name = 'JWTException';
    this.status = status;
  }
}

export enum JwtStatus {
  NO_AUTH_TOKEN,
  EXPIRED,
}
