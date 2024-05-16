// eslint-disable-next-line @typescript-eslint/no-explicit-any
const urlPaths: any = {
  apiBaseUrl: import.meta.env.VITE_DINE_HUB_API_BASE_URL,
  restaurants: "/restaurants",
  ratings: "/ratings",
};

const getUrl = (urlName: string) => {
  return urlPaths[urlName];
};

export default getUrl;
