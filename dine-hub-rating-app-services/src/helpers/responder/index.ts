import { HttpStatusCode } from "axios";
import { DEFAULT_RESPONSE_HEADERS } from "../../utils/constants";

export const sendResponse = (
  statusCode: HttpStatusCode,
  message: string,
  data?: Record<string, any>
) => {
  return {
    statusCode,
    headers: DEFAULT_RESPONSE_HEADERS,
    body: JSON.stringify({ message, data }),
  };
};
