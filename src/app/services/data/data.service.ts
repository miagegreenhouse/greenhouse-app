import { Injectable } from '@angular/core';
import {MessageType, SocketService} from '../socket/socket.service';
import {Events} from '@ionic/angular';
import {ToastService} from '../toast/toast.service';
import {RestService} from '../rest/rest.service';
import {Observable} from 'rxjs';
import {SensorConfig, Email} from '../../model';

export interface DataMessage {
  [key: string]: SensorData[]; // sensorId => SensorData
}

export interface SensorGroup {
  _id: string;
  name: string; // ex : Temperature de l'eau
  sensorsId: Set<string>; // sensorId set
}

export interface SensorData {
  time: string;
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

  sensorsGroups: { [key: string]: SensorGroup } = {}; // dataId => SensorGroup
  sensorsConfigs: {[key: string]: SensorConfig } = {}; // sensorId => SensorConfig
  sensorsDatas: {[key: string]: number[][] } = {}; // sensorId => [time, value][]
  sensorsDatasCustomRange: {[key: string]: number[][] } = {}; // sensorId => [time, value][]
  sources: Set<string> = new Set();

  alerts: { [key: string]: AlertMessage} = {}; // alertId => AlertMessage
  mails: Set<Email> = new Set();

  constructor(private socketService: SocketService,
              private toastService: ToastService,
              public restService: RestService,
              private events: Events) {

    // TODO: Get requests
    // url/sensorsGroup
    // url/sensorsConfig
    // url/alerts
    // url/mails

    new Promise((resolve, reject) => {
      this.restService.getSensorsGroups().subscribe((sensorsGroups: SensorGroup[]) => {
        sensorsGroups.forEach(sensorGroup => {
          this.sensorsGroups[sensorGroup._id] = sensorGroup;
          this.sensorsGroups[sensorGroup._id].sensorsId = new Set<string>();
          resolve();
        });
      }, reject);
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.restService.getSensorsConfigs().subscribe((sensorsConfigs: SensorConfig[]) => {
          sensorsConfigs.forEach(sensorConfig => {
            this.sensorsConfigs[sensorConfig._id] = sensorConfig;
            this.sensorsDatas[sensorConfig._id] = [];
            if (this.sensorsGroups[sensorConfig.sensorGroupId] !== undefined) {
              this.sensorsGroups[sensorConfig.sensorGroupId].sensorsId.add(sensorConfig._id);
            }
            resolve();
          });
          console.log(this.sensorsConfigs);
        }, reject);
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        this.restService.getSensorsData(null, null).subscribe((sensorsData: any) => {
          console.log(sensorsData);
          Object.keys(sensorsData).forEach(sensorId => {
            const datas = this.sensorsDatas[sensorId];
            sensorsData[sensorId].forEach(data => {
              datas.push([parseInt(data.time), data.value]);
            });
          });
          resolve();
        }, reject);
      });
    }).then(() => {

    }).catch(err => {
      console.error(err);
      // TODO
    });

    this.restService.getEmails().subscribe((mails: Email[]) => {
      mails.forEach(mail => this.mails.add(mail));
    });

    events.subscribe(MessageType.DATA, (dataMessage: DataMessage) => {
      // For each sensor in data
      Object.keys(dataMessage).forEach(sensorId => {
        const messageSensor = dataMessage[sensorId];
        if (!this.sensorsDatas[sensorId]) { // if object does not exists in map
          this.sensorsDatas[sensorId] = [];
        }
        const sensorDatas = this.sensorsDatas[sensorId];

        dataMessage[sensorId].forEach(sensorData => {
          sensorDatas.push([parseInt(sensorData.time), sensorData.value]);
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

  }

  getSensorGroups(): SensorGroup[] {
    return Object.values(this.sensorsGroups);
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

  getMails(): Email[] {
    return Array.from(this.mails);
  }

  getSensorData(sensorId: string, isLive: boolean): number[][] {
    let sensorsDatas: number[][] = [];
    if (isLive) {
      sensorsDatas = this.sensorsDatas[sensorId];
    } else {
      sensorsDatas = this.sensorsDatasCustomRange[sensorId];
    }
    return sensorsDatas ? sensorsDatas : [];
  }

  getDataSensorsId(dataId: string): string[] {
    return Array.from(this.sensorsGroups[dataId].sensorsId);
  }

  getSensorConfig(sensorId: string): SensorConfig {
    return this.sensorsConfigs[sensorId];
  }

  hasData(dataId: string): boolean {
    return this.sensorsDatas !== undefined && this.sensorsDatas[dataId] !== undefined;
  }

  getDatasInDateRange(startTimestamp: number, endTimestamp: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.restService.getSensorsData(startTimestamp, endTimestamp).subscribe((sensorsData: any) => {
        this.sensorsDatasCustomRange = {};
        Object.keys(sensorsData).forEach(sensorId => {
          if (!this.sensorsDatasCustomRange[sensorId]) {
            this.sensorsDatasCustomRange[sensorId] = [];
          }
          const datas = this.sensorsDatasCustomRange[sensorId];
          sensorsData[sensorId].forEach(data => {
            datas.push([parseInt(data.time), data.value]);
          });
        });
        resolve();
      }, reject);
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
    return this.restService.createEmail({email: email});
    // TODO : remove below: just a mock
    // return new Observable<any>(observer => {
    //   this.mails.add(email);
    //   observer.next(email);
    //   this.toastService.showToast(email + ' ajouté', 'success', 3000);
    // });
  }

  removeMail(email: Email): Observable<any> {
    // TODO (jules) : Rest DELETE
    return this.restService.deleteEmail(email);
    // TODO : remove below: just a mock
    // return new Observable<any>(observer => {
    //   this.mails.delete(email);
    //   observer.next(email);
    //   this.toastService.showToast(email + ' supprimé', 'success', 3000);
    // });
  }

  editSensor(sensorConfigEdit: SensorConfig): Observable<any> {
    // TODO (jules): REST PUT
    // TODO : remove below: just a mock
    return new Observable<any>(observer => {

      // Remove sensor from previous data
      const oldSensorConfig = this.sensorsConfigs[sensorConfigEdit._id];

      // Add sensor to new data
      this.sensorsConfigs[sensorConfigEdit._id] = sensorConfigEdit;

      this.restService.updateSensorsConfig(sensorConfigEdit).subscribe(() => {
        observer.next(sensorConfigEdit);
      }, observer.error);
      this.toastService.showToast(sensorConfigEdit.sensorName + ' édité', 'success', 3000);
    });
  }
}
