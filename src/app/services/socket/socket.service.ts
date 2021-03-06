import { Injectable } from '@angular/core';

import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';

import { Events } from '@ionic/angular';
import {AlertMessage, DataMessage} from '../data/data.service';

export enum WebSocketProtocol {
    WS = 'ws',
    WSS = 'wss'
}

export enum OpCodes {
	IDENTIFICATION = 0x00,
	ACTION = 0x01,
	MQTT_MSG = 0x02
}

export enum MessageType {
	DATA = 'data',
	ALERT = 'alert'
}

export interface Message {
	type: MessageType;
	data: DataMessage | AlertMessage;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

	private socket;

	constructor(public events: Events) {}

	/**
	 * Initialisation of the socket
	 * @return {void}
	 */
	initSocket = (wsProtocol: WebSocketProtocol, domain: string, onError?: (error) => any): void => {
		let url = (wsProtocol + "://" + domain);
		console.log("Trying to listening socket at url : " + url);
		this.socket = socketIo(url);
		console.log("Socket listening");
		if (onError) {
			this.onError().subscribe(onError);
		} else {
			// this.onError().subscribe(this.socketErrorHandler);
		}
	}

	/**
	 * Close the current socket
	 * @return {void}
	 */
	close = (): void => {
		console.log("Socket disconnecting");
		if (this.socket) {
			return this.socket.disconnect();
		}
	}

	/**
	 * Function that handles socket error
	 * @return {void}
	 */
	// socketErrorHandler = (error): void => {
	// 	this.events.publish(AppEvents.SOCKET_ERROR, error);
	// }

	/**
	 * Send an object
	 * @param {any} object The object you want to send
	 * @return {void}
	 */
	send = (object: any) : void => {
		this.socket.emit('message', {data: JSON.stringify(object)});
	}

	/**
	 * Function that will be executed on message
	 * @return {Observable} An Observable which resolves each message received
	 */
	onMessage = (): Observable<Message> => {
		return new Observable(observer => {
			this.socket.on('message', (message: Message) => {
				console.log(message);
				this.events.publish(message.type, message.data);
				observer.next(message);
			});
		});
	}

	/**
	 * Function that will be executed on error
	 * @return {Observable} An Observable which resolves each error
	 */
	onError = (): Observable<any> => {
		return new Observable(observer => {
			this.socket.on('connect_error', (error: any) => observer.next(error));
		})
	}

	/**
	 * Function that will be executed on event
	 * @param {SocketEvent} event The event observed
	 * @return {Observable<SocketEvent>} An Observable which resolves each event received
	 */
	onEvent = (event): Observable<any> => {
		return new Observable<any>(observer => {
			this.socket.on('event', () => observer.next(event));
		});
  }

}
