import {AbstractControl} from '@angular/forms';
import {Subscription}    from 'rxjs';

export class ValidatorsUtil {

  public static equal(controlName: string) {
    return (thisControl: AbstractControl): { [key: string]: any } => {
      const thatControl: AbstractControl = thisControl.root.get(controlName);
      if (thatControl) {
        const subscription: Subscription = thatControl
        .valueChanges
        .subscribe(() => {
          thisControl.updateValueAndValidity();
          subscription.unsubscribe();
        });
      }
      return (thatControl && thisControl.value !== thatControl.value) ? {equal: true} : null;
    };
  }

}

