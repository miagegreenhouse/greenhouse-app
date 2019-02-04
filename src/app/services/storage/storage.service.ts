import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Return a stringified js object stored in the localStorage
   * @param key the key of the localStorage value
   */
  get(key : string){
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Stringify a value and store it the localStorage.
   * @param key the key of the value to store
   * @param value the value to store, must be an object
   */
  set(key: string, value: any){
    if(typeof value != 'object'){
      throw 'Must be a json object';
    }
    localStorage.setItem(key,JSON.stringify(value));
  }
}
