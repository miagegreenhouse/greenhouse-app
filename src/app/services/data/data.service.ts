import { Injectable } from '@angular/core';
import {MessageType, SocketService} from '../socket/socket.service';
import {Events} from '@ionic/angular';

export interface DataMessage {
  [key: string]: { // key dataId
    [key: string]: { // key is captorId
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
  captors: { [key: string]: Captor; }; // key: captorId
}

export interface Captor {
  captorId: string; // uniqueId
  source: string;
  nom: string;
  data: CaptorData[];
}

export interface CaptorData {
  timestamp: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  datas: { [key: string]: Data; } = {}; // key is dataId
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
              captors: {},
              dataId: dataId,
              name: Math.random().toString(36).substring(7)
            };
          }
          const data: Data = this.datas[dataId];

          // For each captor in data
          Object.keys(messageData).forEach(captorId => {
            const messageCaptor = messageData[captorId];
            if (data.captors[captorId] === undefined) { // if object does not exists in map
              data.captors[captorId] = {
                nom: Math.random().toString(36).substring(7),
                source: Math.random().toString(36).substring(7),
                captorId: captorId,
                data: []
              };
            }
            const captor: Captor = data.captors[captorId];

            // Add data from message
            captor.data.push({
              timestamp: messageCaptor.timestamp,
              value: messageCaptor.value
            });
          });
          this.events.publish('updateData:' + dataId);
        });
      }
    });
  }

  getDatas(): Data[] {
    return Object.values(this.datas);
  }
}
