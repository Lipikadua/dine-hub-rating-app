export interface Restaurants {
  id?: number;
  RestaurantId: string;
  Address: string;
  Description: string;
  Name: string;
  Hours: string;
  AverageRating?: number;
  UserRating?: number;
}
export interface RestaurantRating {
  RestaurantId: string;
  UserName: string;
  Rating?: number;
}

export interface ParentModal {
  modalOpen: boolean | null;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export interface ChildModal {
  modalOpen: boolean | null;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  onSubmit: React.Dispatch<React.SetStateAction<null>>;
}
