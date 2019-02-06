import { Injectable } from '@angular/core';
import {MessageType, SocketService} from '../socket/socket.service';
import {Events} from '@ionic/angular';
import {ToastService} from '../toast/toast.service';

export interface DataMessage {
  [key: string]: { // key dataId
    [key: string]: { // key is sensorId
      timestamp: number;
      value: any;
    }
  };
}

export interface Data {
  name: string; // ex: Temperature
  dataId: string;
  min: number;
  max: number;
  sensor: { [key: string]: Sensor; }; // key: sensorId
}

export interface Sensor {
  sensorId: string; // uniqueId
  dataId: string;
  source: string;
  nom: string;
  data: SensorData[];
}

export interface SensorData {
  timestamp: number;
  value: number;
}

export interface Alert {
  alertId: string;
  sensorId: string;
  dataId: string;
  timestamp: number;
  message: string;
  value: number;
  acquit: {
   timestamp: number;
   userId: number;
  };
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  datas: { [key: string]: Data; } = {}; // key is dataId
  sources: Set<string> = new Set();
  alerts: { [key: string]: Alert} = {}; // key is alertId
  mails: string[];

  constructor(private socketService: SocketService,
              private toastService: ToastService,
              private events: Events) {
    this.mockData();
    events.subscribe('data', (message) => {
    // this.socketService.onMessage().subscribe(message => { // TODO: user event triggered in socket
      if (message.type === MessageType.DATA) {
        const  dataReceived = message.data as DataMessage;

        // For each data in message
        Object.keys(message.data).forEach(dataId => {
          const messageData = dataReceived[dataId];
          if (this.datas[dataId] === undefined) { // if object does not exists in map
            this.datas[dataId] = {
              max: null,
              min: null,
              sensor: {},
              dataId: dataId,
              name: Math.random().toString(36).substring(7)
            };
          }
          const data: Data = this.datas[dataId];

          // For each sansor in data
          Object.keys(messageData).forEach(sensorId => {
            const messageCaptor = messageData[sensorId];
            if (data.sensor[sensorId] === undefined) { // if object does not exists in map
              data.sensor[sensorId] = {
                nom: Math.random().toString(36).substring(7),
                source: Math.random().toString(36).substring(7),
                sensorId: sensorId,
                dataId: dataId,
                data: []
              };
            }
            const sensor: Sensor = data.sensor[sensorId];

            // Add data from message
            sensor.data.push({
              timestamp: messageCaptor.timestamp,
              value: messageCaptor.value
            });

            this.sources.add(sensor.source);
          });
          this.events.publish('updateData:' + dataId);
        });
      }
    });
  }

  getDatas(): Data[] {
    return Object.values(this.datas);
  }

  getSources(): string[] {
    return Array.from(this.sources);
  }

  getAlerts(): Alert[] {
    return Object.values(this.alerts);
  }

  private mockData() {
    this.alerts['1'] = {
      timestamp: new Date().getTime(),
      alertId: '1',
      message: 'Attention il fait trop chaud',
      value: 35,
      sensorId: '1',
      dataId: '1',
      acquit: null
    };
    this.alerts['2'] = {
      timestamp: new Date().getTime(),
      alertId: '2',
      message: 'Attention il fait trop froid',
      value: 9,
      sensorId: '1',
      dataId: '1',
      acquit: null
    };
  }

  acquitAlert(alertId: string) {
    // TODO: POST request
    this.alerts[alertId].acquit = {
      timestamp: new Date().getTime(),
      userId: 1
    };
    this.toastService.showToast('Alerte acquittée', 'success', 3000);
  }
}
