import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  /**
   * Show a toast with a text, a color and a callback function when the toast is dismissed
   * @param {string} text The text to show
   * @param {string} color The color of the toast
   * @param {function} onDismiss The callback
   * @memberof ToastService
   */
   showToast(text: string, color?: string, onDismiss?: () => any) {
    this.toastController.create({
      color: (color ? color : 'danger'),
      message: text,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok'
    }).then(toast => {
      toast.present();
      if (onDismiss) {
        toast.onDidDismiss().then(onDismiss);
      }
    });
  }

}