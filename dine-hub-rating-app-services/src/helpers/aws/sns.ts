import * as AWS from "aws-sdk";
import { TOPIC_ARN } from "../../utils/constants";

const sns = new AWS.SNS();
//attach to lambda, should not be here

export const sendAlert = async (
  restaurantName: string,
  avgRating: number,
  previousAverageRating: number
) => {
  const message = `Alert: avgRating for restaurant ${restaurantName} went below ${previousAverageRating}. New avgRating: ${avgRating}`;

  await sns
    .publish({
      TopicArn: TOPIC_ARN,
      Message: message,
    })
    .promise();
};
