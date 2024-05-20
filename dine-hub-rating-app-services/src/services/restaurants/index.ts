import {
  APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  Context,
} from "aws-lambda";
import { HttpStatusCode } from "axios";
import { sendResponse } from "../../helpers/responder";
import { getLogger, initLogger } from "../../utils/logger";
import { ErrorMessage } from "../../utils/enums";
import {
  editRestaurant,
  deleteRestaurant,
  addRestaurant,
  getAllRestaurants,
  addRating,
} from "../../helpers/restaurants/restaurantsDbHelper";

const logger = getLogger("Restaurants");

export const handler = async (event: APIGatewayEvent, context: Context) => {
  //logger
  initLogger(logger, event, context);
  logger.info("Inside handler", { event });
  const requestBody = JSON.parse(event.body ?? "{}");
  const path = event.path;
  const pathParameters = event.pathParameters;
  const httpMethod = event.httpMethod.toUpperCase();
  const restaurantId = event.pathParameters?.restaurantId;

  //addRestaurant
  if (path === "/restaurants" && httpMethod === "POST") {
    try {
      const id = await addRestaurant(requestBody);
      logger.info(`addRestaurant response - RestaurantId - ${id}`);
      return sendResponse(HttpStatusCode.Ok, ErrorMessage.RestaurantAdded, {
        id,
      });
    } catch (err) {
      const error = err as Error;
      logger.error("Lambda error", { error });
      return sendResponse(
        HttpStatusCode.InternalServerError,
        (error as Error).message
      );
    }
  }
  // getAllRestaurants
  else if (path === "/restaurants" && httpMethod === "GET") {
    const response = await getAllRestaurants();
    logger.info("getAllRestaurants", { response });
    return sendResponse(
      HttpStatusCode.Ok,
      ErrorMessage.Success,
      response.Items
    );
  }
  //editRestaurant
  else if (
    path.startsWith("/restaurants/") &&
    pathParameters &&
    pathParameters.restaurantId &&
    typeof pathParameters.restaurantId !== undefined &&
    httpMethod === "PUT"
  ) {
    if (
      restaurantId &&
      requestBody.Name &&
      requestBody.Description &&
      requestBody.Address &&
      requestBody.Hours
    ) {
      try {
        const response = await editRestaurant(restaurantId, requestBody);
        return sendResponse(
          HttpStatusCode.Ok,
          ErrorMessage.RestaurantUpdated,
          response.Attributes
        );
      } catch (err) {
        const error = err as Error;
        logger.error("Lambda error", { error });
        if (error.message == "The conditional request failed") {
          return sendResponse(HttpStatusCode.NotFound, ErrorMessage.NotFound);
        }
        return sendResponse(
          HttpStatusCode.InternalServerError,
          (error as Error).message
        );
      }
    }
  }
  //deleteRestaurant
  else if (path.startsWith("/restaurants/") && httpMethod === "DELETE") {
    if (restaurantId) {
      try {
        const response = await deleteRestaurant(restaurantId);
        return sendResponse(
          HttpStatusCode.Ok,
          ErrorMessage.RestaurantDeleted,
          response.Attributes
        );
      } catch (err) {
        const error = err as Error;
        logger.error("Lambda error", { error });
        return sendResponse(
          HttpStatusCode.InternalServerError,
          (error as Error).message
        );
      }
    }
  }
  //addRating
  else if (path === "/ratings" && httpMethod === "POST") {
    if (
      requestBody.RestaurantId &&
      requestBody.UserName &&
      requestBody.Rating
    ) {
      const response = await addRating(requestBody);
      return sendResponse(HttpStatusCode.Ok, ErrorMessage.RatingAdded, {
        response,
      });
    }
  }

  // Default return statement
  return sendResponse(HttpStatusCode.BadRequest, ErrorMessage.BadRequest, {
    message: "Invalid request",
  });
};

//move db functions to helper section and use TableName from enums
