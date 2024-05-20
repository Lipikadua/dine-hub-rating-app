import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { getLogger } from "../../utils/logger";
import {
  ScanCommand,
  DeleteCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { TableName } from "../../utils/enums";
import {
  deleteItem,
  getAllItems,
  putItem,
  queryItem,
  updateItem,
} from "../aws/dynamoDb";
import { v4 as uuidv4 } from "uuid";
import { sendAlert } from "../aws/sns";

export const addRestaurant = async (requestBody: any) => {
  const { Name, Description, Address, Hours } = requestBody;

  const restaurantId = uuidv4();

  const newRestaurant = {
    RestaurantId: restaurantId,
    Name: Name,
    Description: Description,
    Address: Address,
    Hours: Hours,
    AverageRating: 0,
  };
  const command = new PutCommand({
    TableName: TableName.Restaurants,
    Item: newRestaurant,
  });

  return await putItem(command);
};
export const getAllRestaurants = async () => {
  const command = new ScanCommand({
    TableName: TableName.Restaurants,
  });
  return await getAllItems(command);
};
export const editRestaurant = async (
  restaurantId: string,
  requestBody: any,
  returnValues: ReturnValue = "NONE"
) => {
  const logger = getLogger();
  logger.info("Inside editRestaurant function");

  const tableName = TableName.Restaurants;
  const { Name, Description, Address, Hours } = requestBody;

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { RestaurantId: restaurantId },
    ExpressionAttributeNames: {
      "#name": "Name", // Using ExpressionAttributeNames to handle reserved word
    },
    UpdateExpression:
      "SET #name = :name, Description = :desc, Address = :addr, Hours = :hours",
    ExpressionAttributeValues: {
      ":name": Name,
      ":desc": Description,
      ":addr": Address,
      ":hours": Hours,
    },
    ReturnValues: returnValues,
  });
  logger.info("update params", { command });
  return await updateItem(command);
};

export const deleteRestaurant = async (restaurantId: string) => {
  const logger = getLogger();
  const command = new DeleteCommand({
    TableName: TableName.Restaurants,
    Key: { RestaurantId: restaurantId },
    ReturnValues: "ALL_OLD",
  });
  logger.info("Delete response", { command });
  return await deleteItem(command);
};

export const addRating = async (requestBody: any) => {
  const { RestaurantId, UserName, Rating } = requestBody;

  const ratingId = uuidv4();
  const newRating = {
    RatingId: ratingId,
    RestaurantId: RestaurantId,
    UserName: UserName,
    Rating: Rating as number,
  };

  const command = new PutCommand({
    TableName: TableName.Ratings,
    Item: newRating,
  });

  await putItem(command);
  // updated average rating in Restaurant table
  await updateAverageRating(RestaurantId);
};

const updateAverageRating = async (restaurantId: string) => {
  const logger = getLogger();
  const queryCommand = new QueryCommand({
    TableName: TableName.Ratings,
    KeyConditionExpression: "RestaurantId = :restaurantId",
    ExpressionAttributeValues: {
      ":restaurantId": restaurantId,
    },
  });

  const result = await queryItem(queryCommand);

  const ratings = result.Items || [];
  if (ratings.length === 0) return;
  if (result.Items && result.Items.length > 0) {
    const restaurantName = result.Items[0].Name;
    const avgRating =
      ratings.reduce((sum, item) => sum + item.Rating, 0) / ratings.length;
    console.log("avgRating new", avgRating, " ratings.length:", ratings.length);

    // updating rating in Restaurant table
    const updateCommand = new UpdateCommand({
      TableName: TableName.Restaurants,
      Key: { RestaurantId: restaurantId },
      UpdateExpression: "set AverageRating = :avgRating",
      ConditionExpression: "AverageRating <> :avgRating",
      ExpressionAttributeValues: {
        ":avgRating": avgRating,
      },
      ReturnValues: "UPDATED_OLD",
    });

    try {
      const response = await updateItem(updateCommand);
      logger.info("Response from Restaurants rating updateItem", response);

      const previousAverageRating = response.Attributes?.AverageRating || 0;

      // If new rating is less than previous one, send alert
      if (avgRating < previousAverageRating) {
        await sendAlert(restaurantName, avgRating, previousAverageRating);
      } else {
      }
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        console.log("Average rating has not changed. No update needed.");
      } else {
        console.error("Error updating average rating:", error);
      }
    }
  }
};
