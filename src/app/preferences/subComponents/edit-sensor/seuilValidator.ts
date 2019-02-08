import { FormControl } from '@angular/forms';
import { SensorConfig } from 'src/app/model';


export const minValueValidator = (max:number) => {
  return (fc:FormControl) => {
    if(max > fc.value){
      return null;
    }
    return ({validSeuil: true});
  };
};

export const maxValueValidator = (min:number) => {
  return (fc:FormControl) => {
    if(min < fc.value){
      return null;
    }
    return ({validSeuil: true});
  };
};