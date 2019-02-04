import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });

  it('should save a value : string', () => {
    const service: StorageService = TestBed.get(StorageService);
    try{
      service.set("myKey","myValue")
    } catch(error){
      expect(error).toBe("Must be a json object");
    }
  });

  it('should save a value : any', () => {
    const service: StorageService = TestBed.get(StorageService);
    var obj = ["a","b","c"];
    service.set("myKey",obj)
    expect(localStorage.getItem("myKey")).toBe('["a","b","c"]');
  });

  it('should get a value : any', () => {
    const service: StorageService = TestBed.get(StorageService);
    //var obj = ["a","b","c"];
    localStorage.setItem("myKey",'["a","b","c"]');
    var obj = service.get("myKey");
    expect(obj[0]).toBe("a");
    expect(obj[1]).toBe("b");
    expect(obj[2]).toBe("c");
  });

});
