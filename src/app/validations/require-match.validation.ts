import { AbstractControl } from '@angular/forms';
 
export function requireMatch(control: AbstractControl) {
    const selection: any = control.value;
    if (selection === null || selection === undefined || typeof selection === 'string' || !selection.middle.type) {
        return { incorrect: true };
    }
    return null;
}