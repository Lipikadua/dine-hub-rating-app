export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum TableName {
  Restaurants = "Restaurants",
  Ratings = "Ratings",
}

export enum ErrorMessage {
  Success = "Success",
  Failure = "Failure",
  MissingPathParams = "Missing path parameters",
  IdMismatch = "Id mismatch",
  NotFound = "Not found",
  AlreadyExists = "Already exists",
  CannotShareWithSelf = "Cannot share with self",
  BadRequest = "Bad request",
  MissingRatingResponse = "Missing rating in request body",
  HttpMethodNotSupported = "HTTP method not supported",
  RestaurantAdded = "Restaurant added successfully",
  RestaurantNotFound = "Restaurant not found",
}
