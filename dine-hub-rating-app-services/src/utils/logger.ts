import { Logger } from "@aws-lambda-powertools/logger";
import { APIGatewayEvent, Context } from "aws-lambda";

let globalLogger: Logger;

export const getLogger = (serviceName?: string) => {
  if (!globalLogger) {
    globalLogger = new Logger({ serviceName });
  }
  return globalLogger;
};

export const initLogger = (
  logger: Logger,
  event: APIGatewayEvent,
  context: Context
) => {


  logger.appendKeys({
    httpMethod: event.httpMethod.toUpperCase(),
    awsRequestId: context.awsRequestId,
  });
};
