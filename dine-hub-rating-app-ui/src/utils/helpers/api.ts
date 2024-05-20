import axios from "axios";
import { RestaurantRating, Restaurants } from "../types";

// Example API functions
export const fetchRestaurants = async () => {
  // Fetch the list of restaurants from your API
  const response = await axios.get(
    `https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/restaurants`
  );
  return response.data.data;
};

export const saveRestaurant = async (data: Restaurants) => {
  // Call your API to save a new restaurant
  const response = await axios.post(
    `https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/restaurants`,
    data
  );
  return response.data.data;
};

export const editRestaurant = async (id: string, data: Restaurants) => {
  // Call your API to edit an existing restaurant
  console.log("data from edit", id, data);
  const response = await axios.put(
    `https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/restaurants/${id}`,
    data
  );
  return response.data.data;
};

export const deleteRestaurant = async (id: string) => {
  // Call your API to delete a restaurant
  const response = await axios.delete(
    `https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/restaurants/${id}`
  );
  return response.data.data;
};

export const addRating = async (data: RestaurantRating) => {
  // Call your API to add a rating
  const response = await axios.post(
    `https://39tia1oajk.execute-api.us-east-1.amazonaws.com/dev/ratings`,
    data
  );
  console.log("rating response", response.data);
  return response.data.data;
};
