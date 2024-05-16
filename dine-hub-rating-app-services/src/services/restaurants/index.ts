import {
  APIGatewayEvent,
  APIGatewayProxyEventPathParameters,
  Context,
} from "aws-lambda";
import * as AWS from "aws-sdk";
import { HttpStatusCode } from "axios";
import { v4 as uuidv4 } from "uuid";
import { sendResponse } from "../../helpers/responder";

import { getLogger, initLogger } from "../../utils/logger";
import { ErrorMessage } from "utils/enums";

const logger = getLogger("Documents");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

//attach to lambda, should not be here
const topicArn =
  "arn:aws:sns:us-east-1:058264155964:avg-rating-alert:8a314229-32fc-43d4-8d56-a90501468574";

export const handler = async (event: APIGatewayEvent, context: Context) => {
  //logger
  initLogger(logger, event, context);
  logger.info("Inside handler", { event });
  const path = event.path;
  const httpMethod = event.httpMethod.toUpperCase();

  if (path === "/restaurants" && httpMethod === "POST") {
    return await addRestaurant(event);
  } else if (path === "/restaurants" && httpMethod === "GET") {
    return getAllRestaurants();
  } else if (path.startsWith("/restaurants/") && httpMethod === "GET") {
    const restaurantId = event.pathParameters?.restaurantId;
    if (restaurantId) return getRestaurant(restaurantId);
  } else if (path.startsWith("/restaurants/") && httpMethod === "PUT") {
    const restaurantId = event.pathParameters?.restaurantId;
    if (restaurantId) return await editRestaurant(restaurantId, event);
  } else if (path.startsWith("/restaurants/") && httpMethod === "DELETE") {
    const restaurantId = event.pathParameters?.restaurantId;
    if (restaurantId) return await deleteRestaurant(restaurantId);
  } else if (path === "/ratings" && httpMethod === "POST") {
    return await addRating(event);
  } else {
    return sendResponse(HttpStatusCode.BadRequest, ErrorMessage.BadRequest, {
      message: "Invalid request",
    });
  }

  // Default return statement
  return sendResponse(
    HttpStatusCode.MethodNotAllowed,
    `${ErrorMessage.HttpMethodNotSupported} - ${event.httpMethod}`
  );
};

//move db functions to helper section and use TableName from enums
const addRestaurant = async (event: any) => {
  const { name, description, address, hours } = JSON.parse(event.body);

  const restaurantId = uuidv4();

  const newRestaurant = {
    restaurantId,
    name,
    description,
    address,
    hours,
    avgRating: 0,
    ratings: [],
  };

  const response = await dynamoDB
    .put({
      TableName: "Restaurants",
      Item: newRestaurant,
    })
    .promise();

  return sendResponse(HttpStatusCode.Ok, ErrorMessage.RestaurantAdded, {
    restaurant: newRestaurant,
  });
};

const getAllRestaurants = async () => {
  const params = {
    TableName: "Restaurants",
  };

  const data = await dynamoDB.scan(params).promise();

  return sendResponse(HttpStatusCode.Ok, ErrorMessage.Success, data.Items);
};

const getRestaurant = async (restaurantId: string) => {
  const restaurantResult = await dynamoDB
    .get({
      TableName: "Restaurants",
      Key: { restaurantId },
    })
    .promise();

  if (!restaurantResult.Item) {
    return sendResponse(
      HttpStatusCode.NotFound,
      ErrorMessage.RestaurantNotFound
    );
  }

  const ratingsResult = await dynamoDB
    .query({
      TableName: "Ratings",
      KeyConditionExpression: "restaurantId = :restaurantId",
      ExpressionAttributeValues: {
        ":restaurantId": restaurantId,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...restaurantResult.Item,
      ratings: ratingsResult.Items || [],
    }),
  };
};

const editRestaurant = async (restaurantId: string, event: any) => {
  const { name, description, address, hours } = JSON.parse(event.body);

  const updateExpression = [];
  const expressionAttributeValues: any = {};

  if (name) {
    updateExpression.push("name = name");
    expressionAttributeValues[":name"] = name;
  }
  if (description) {
    updateExpression.push("description = :description");
    expressionAttributeValues[":description"] = description;
  }
  if (address) {
    updateExpression.push("address = :address");
    expressionAttributeValues[":address"] = address;
  }
  if (hours) {
    updateExpression.push("hours = :hours");
    expressionAttributeValues[":hours"] = hours;
  }

  if (updateExpression.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No fields to update" }),
    };
  }

  const params = {
    TableName: "Restaurants",
    Key: { restaurantId },
    UpdateExpression: "set " + updateExpression.join(", "),
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  const result = await dynamoDB.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Restaurant updated successfully",
      restaurant: result.Attributes,
    }),
  };
};

const deleteRestaurant = async (restaurantId: string) => {
  const params = {
    TableName: "Restaurants",
    Key: { restaurantId },
    ReturnValues: "ALL_OLD",
  };

  const result = await dynamoDB.delete(params).promise();

  if (!result.Attributes) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Restaurant not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Restaurant deleted successfully",
      restaurant: result.Attributes,
    }),
  };
};

const addRating = async (event: any) => {
  const { restaurantId, userId, ratingValue } = JSON.parse(event.body);

  const ratingId = uuidv4();

  await dynamoDB
    .put({
      TableName: "Ratings",
      Item: {
        ratingId,
        restaurantId,
        userId,
        ratingValue,
      },
    })
    .promise();

  await updateAverageRating(restaurantId);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Rating added successfully" }),
  };
};

const updateAverageRating = async (restaurantId: string) => {
  const result = await dynamoDB
    .query({
      TableName: "Ratings",
      KeyConditionExpression: "restaurantId = :restaurantId",
      ExpressionAttributeValues: {
        ":restaurantId": restaurantId,
      },
    })
    .promise();

  const ratings = result.Items || [];
  if (ratings.length === 0) return;

  const avgRating =
    ratings.reduce((sum, rating) => sum + rating.ratingValue, 0) /
    ratings.length;

  await dynamoDB
    .update({
      TableName: "Restaurants",
      Key: { restaurantId },
      UpdateExpression: "set avgRating = :avgRating",
      ExpressionAttributeValues: {
        ":avgRating": avgRating,
      },
    })
    .promise();

  const previousAverageRatingResult = await dynamoDB
    .get({
      TableName: "Restaurants",
      Key: { restaurantId },
    })
    .promise();

  const previousAverageRating =
    previousAverageRatingResult.Item?.avgRating || 0;

  if (avgRating < previousAverageRating) {
    await sendAlert(restaurantId, avgRating, previousAverageRating);
  }
};

const sendAlert = async (
  restaurantId: string,
  avgRating: number,
  previousAverageRating: number
) => {
  const message = `Alert: avgRating for restaurant ${restaurantId} went below ${previousAverageRating}. New avgRating: ${avgRating}`;

  //move to sns section
  await sns
    .publish({
      TopicArn: topicArn,
      Message: message,
    })
    .promise();
};
