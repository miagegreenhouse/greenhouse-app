import { Injectable } from '@angular/core';
import {MessageType, SocketService} from '../socket/socket.service';
import {Events} from '@ionic/angular';
import {ToastService} from '../toast/toast.service';
import {RestService} from '../rest/rest.service';
import {Observable} from 'rxjs';
import {SensorConfig} from '../../model';

export interface DataMessage {
  [key: string]: SensorData[]; // sensorId => SensorData
}

export interface SensorGroup {
  dataId: string;
  name: string; // ex: Temperature de l'eau
  sensorsId: Set<string>; // sensorId set
}

export interface SensorData {
  timestamp: number;
  value: number;
}

export interface AlertMessage {
  alertId: string;
  sensorId: string;
  dataId: string;
  timestamp: number;
  message: string;
  value: number;
  acquit: {
   timestamp: number;
   email: string;
  };
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  datas: { [key: string]: SensorGroup } = {}; // dataId => SensorGroup
  sensorsDatas: {[key: string]: SensorData[] } = {}; // sensorId => SensorData[]
  sensorsConfigs: {[key: string]: SensorConfig } = {}; // sensorId => SensorConfig
  sources: Set<string> = new Set();

  alerts: { [key: string]: AlertMessage} = {}; // alertId => AlertMessage
  mails: Set<string> = new Set();

  constructor(private socketService: SocketService,
              private toastService: ToastService,
              public restService: RestService,
              private events: Events) {

    // TODO: Get requests
    // url/datas
    // url/sensorsConfigs
    // url/alerts
    // url/mails

    events.subscribe(MessageType.DATA, (dataMessage: DataMessage) => {
      // For each sensor in data
      Object.keys(dataMessage).forEach(sensorId => {
        const messageSensor = dataMessage[sensorId];
        if (this.sensorsDatas[sensorId] === undefined) { // if object does not exists in map
          this.sensorsDatas[sensorId] = [];
        }
        const sensorDatas = this.sensorsDatas[sensorId];

        sensorDatas.forEach(sensorData => {
          sensorDatas.push(sensorData);
        });

        this.events.publish('updateData:' + this.sensorsConfigs[sensorId].dataId);
      });
    });

    events.subscribe(MessageType.ALERT, (alertMessage: AlertMessage) => {
      this.alerts[alertMessage.alertId] = alertMessage;
      if (alertMessage.acquit) {
        this.toastService.showToast('Alerte acquittée', 'success', 3000);
      } else {
        this.toastService.showToast(alertMessage.message, 'warning', 3000);
      }
    });

    this.mockData();
  }

  getDatas(): SensorGroup[] {
    return Object.values(this.datas);
  }

  getSensorsConfig(): SensorConfig[] {
    return Object.values(this.sensorsConfigs);
  }

  getSources(): string[] {
    return Array.from(this.sources);
  }

  getAlerts(): AlertMessage[] {
    return Object.values(this.alerts);
  }

  getMails(): string[] {
    return Array.from(this.mails);
  }

  getSensorData(sensorId: string): SensorData[] {
    return this.sensorsDatas[sensorId];
  }

  getSensorConfig(sensorId: string): SensorConfig {
    return this.sensorsConfigs[sensorId];
  }

  private mockData() {
    this.mails.add('test@gmail.com');
    this.mails.add('test2@gmail.com');

    for (let i = 0; i < 10; i++) {
      const dataId = (Math.random() > 0.5 ? '1' : '2');
      const sensorId = (Math.random() > 0.5 ? '1' : '2');
      const data = {
        timestamp: new Date().getTime(),
        value: Math.random()
      };
      const dataCaptor = {};
      dataCaptor[sensorId] = data;
      const dataMessage = {};
      dataMessage[dataId] = dataCaptor;
      this.events.publish(MessageType.DATA, dataMessage);
    }

    this.events.publish(MessageType.ALERT, {
      timestamp: new Date().getTime(),
      alertId: '1',
      message: 'Attention il fait trop chaud',
      value: 35,
      sensorId: '1',
      dataId: '1',
      acquit: null
    });
    this.events.publish(MessageType.ALERT, {
      timestamp: new Date().getTime(),
      alertId: '2',
      message: 'Attention il fait trop froid',
      value: 9,
      sensorId: '1',
      dataId: '1',
      acquit: null
    });
  }

  acquitAlert(alertId: string) {
    // TODO (jules) : Rest POST
    // TODO : remove below: just a mock
    this.alerts[alertId].acquit = {
      timestamp: new Date().getTime(),
      email: 'test'
    };
    this.events.publish(MessageType.ALERT, this.alerts[alertId]);
  }

  addMail(email: string): Observable<any> {
    // TODO (jules) : Rest POST
    // TODO : remove below: just a mock
    return new Observable<any>(observer => {
      this.mails.add(email);
      observer.next(email);
      this.toastService.showToast(email + ' ajouté', 'success', 3000);
    });
  }

  removeMail(email: string): Observable<any> {
    // TODO (jules) : Rest DELETE
    // TODO : remove below: just a mock
    return new Observable<any>(observer => {
      this.mails.delete(email);
      observer.next(email);
      this.toastService.showToast(email + ' supprimé', 'success', 3000);
    });
  }

  editSensor(sensorConfigEdit: SensorConfig): Observable<any> {
    // TODO (jules): REST PUT
    // TODO : remove below: just a mock
    return new Observable<any>(observer => {

      // Remove sensor from previous data
      const oldSensorConfig = this.sensorsConfigs[sensorConfigEdit.sensorId];
      if (oldSensorConfig) {
        this.datas[oldSensorConfig.sensorId].sensorsId.delete(oldSensorConfig.dataId);
      }

      // Add sensor to new data
      this.sensorsConfigs[sensorConfigEdit.sensorId] = sensorConfigEdit;
      this.datas[sensorConfigEdit.dataId].sensorsId.add(sensorConfigEdit.sensorId);

      observer.next(sensorConfigEdit);
      this.toastService.showToast(sensorConfigEdit.name + ' édité', 'success', 3000);
    });
  }
}
