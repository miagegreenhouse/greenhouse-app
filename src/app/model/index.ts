export interface User {
  _id: string;
  email: string;
}

export interface UserForm {
  email: string;
  password: string;
}

export interface UserRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AppConfig {
  debuggin: boolean;
  restApi: {
    [key: string]: ApiEntry
  };
  host: string;
  method: string;
}

export interface ApiEntry {
  url: string;
  method: HTTPMethod;
}

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface SensorConfig {
  _id: string;
  sensorName?: string;
  sensorGroupId?: string;
  dataId?: string;
  dataSource?: number;
  unit?: string;
  minThresholdValue?: number;
  minThresholdAlertMessage?: string;
  maxThresholdValue?: number;
  maxThresholdAlertMessage?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface Email {
  _id: string;
  createdDate: string;
  email: string;
  lastModifiedDate: string;
}
