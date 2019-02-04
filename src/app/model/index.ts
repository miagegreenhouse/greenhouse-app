export interface User {
  _id: string,
  email: string
};

export interface UserForm {
  email: string,
  password: string
};

export interface AppConfig {
  debuggin: boolean,
  restApi: {
    [key: string]: ApiEntry
  },
  host: string,
  method: string
};

export interface ApiEntry {
  url: string,
  method: HTTPMethod
};

export enum HTTPMethod {
  GET="GET",
  POST="POST",
  PUT="PUT",
  DELETE="DELETE"
};