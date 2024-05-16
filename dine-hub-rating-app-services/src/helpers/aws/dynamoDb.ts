import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getLogger } from "../../utils/logger";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export type hashKeyRangeKey = Record<string, string | number | boolean>;

export async function getAllItems(tableName: string) {
  const logger = getLogger();

  logger.info(`getAllItems for table: ${tableName}`);
  const command = new ScanCommand({
    TableName: tableName,
  });

  const response = await docClient.send(command);
  return response;
}

export async function getItem(
  hashKeyRangeKeyObj: hashKeyRangeKey,
  tableName: string
) {
  const logger = getLogger();

  logger.info(`getItem for table: ${tableName}`, { hashKeyRangeKeyObj });

  const command = new GetCommand({
    TableName: tableName,
    Key: hashKeyRangeKeyObj,
  });

  const response = await docClient.send(command);
  logger.info("Get response", { response });
  return response;
}

export async function putItem(
  item: Record<string, any>,
  tableName: string,
  conditionExpression?: string
) {
  const logger = getLogger();

  logger.info(`putItem for table: ${tableName}`, { item });

  const command = new PutCommand({
    TableName: tableName,
    Item: item,
    ...(conditionExpression && { ConditionExpression: conditionExpression }),
  });
  logger.info("Put input", { command });

  const response = await docClient.send(command);
  logger.info("Put response", { response });
  return response;
}

export async function deleteItem(
  hashKeyRangeKeyObj: hashKeyRangeKey,
  tableName: string,
  returnValues: ReturnValue = "ALL_OLD"
) {
  const logger = getLogger();

  logger.info(
    `deleteItem for table: ${tableName} using returnValues as ${returnValues}`,
    { hashKeyRangeKeyObj }
  );

  const command = new DeleteCommand({
    TableName: tableName,
    Key: hashKeyRangeKeyObj,
    ReturnValues: returnValues,
  });

  const response = await docClient.send(command);
  logger.info("Delete response", { response });
  return response;
}

export async function queryItem(command: QueryCommand) {
  const logger = getLogger();

  const response = await docClient.send(command);
  logger.info("Query response", { response });
  return response;
}

export async function updateItem(command: UpdateCommand) {
  const logger = getLogger();

  const response = await docClient.send(command);
  logger.info("Update response", { response });
  return response;
}
