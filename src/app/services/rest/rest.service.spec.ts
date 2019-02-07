import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';

describe('RestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
        IonicModule.forRoot()
    ],
    providers: [
        RestService
    ]
  }));

  it('should be created', () => {
    const service: RestService = TestBed.get(RestService);
    expect(service).toBeTruthy();
  });

  // No parameters
  it('GET should get request value', function () {
    const service: RestService = TestBed.get(RestService);
    service.apiUrl = 'https://httpbin.org/';
    service.get('get').subscribe(value => {
      console.log(value);
      expect(value.url).toBe('https://httpbin.org/get');
    });
  });

  // One parameters
  it('GET should get request value one param', function () {
    const service: RestService = TestBed.get(RestService);
    service.apiUrl = 'https://httpbin.org/';
    service.get('get', [
        {name: 'foo', value: 12}
        ]).subscribe(value => {
      console.log(value);
      expect(value.url).toBe('https://httpbin.org/get');
      expect(value.args.foo).toBe('12');
    });
  });

  // Several parameters
  it('GET should get request value multiple params', function () {
    const service: RestService = TestBed.get(RestService);
    service.apiUrl = 'https://httpbin.org/';
    service.get('get', [
      {name: 'fooNumber', value: 12},
      {name: 'fooBoolean', value: true},
      {name: 'fooString', value: 'test'}
    ]).subscribe(value => {
      console.log(value);
      expect(value.url).toBe('https://httpbin.org/get');
      expect(value.args.fooNumber).toBe('12');
      expect(value.args.fooBoolean).toBe('true');
      expect(value.args.fooString).toBe('test');
    });
  });

  // Post single number
  it('POST single value', function () {
    const data = 123;
    const service: RestService = TestBed.get(RestService);
    service.apiUrl = 'https://httpbin.org/';
    service.post('post', data, [
      {name: 'fooNumber', value: 12}
    ]).subscribe(value => {
      console.log(value);
      expect('' + value.data).toBe('' + 123);
    });
  });
});
