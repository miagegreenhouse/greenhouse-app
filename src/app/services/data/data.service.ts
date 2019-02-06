import { Injectable } from '@angular/core';
import {MessageType, SocketService} from '../socket/socket.service';
import {Events} from '@ionic/angular';

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
  source: string;
  nom: string;
  data: SensorData[];
}

export interface SensorData {
  timestamp: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  datas: { [key: string]: Data; } = {}; // key is dataId
  sources: Set<string> = new Set();
  mails: string[];

  constructor(private socketService: SocketService, private events: Events) {
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
}
