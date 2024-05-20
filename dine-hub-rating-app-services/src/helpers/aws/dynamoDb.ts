import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getLogger } from "../../utils/logger";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export type hashKeyRangeKey = Record<string, string | number | boolean>;

export async function getAllItems(command: ScanCommand) {
  const logger = getLogger();

  const response = await docClient.send(command);
  logger.info("Scan response", { response });
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
export async function putItem(command: PutCommand) {
  const logger = getLogger();

  const response = await docClient.send(command);
  logger.info("Put response", { response });
  return response;
}

export async function deleteItem(command: DeleteCommand) {
  const logger = getLogger();
  const response = await docClient.send(command);
  logger.info("Delete response", { response });
  return response;
}
