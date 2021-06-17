export interface UserData {
  username: string;
  email: string;
  token?: string;
  deleted: boolean;
  image?: string;
}

export interface UserRO {
  user: UserData;
}