import { Component, Input, Optional, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';

@Component({
  selector: 'i-input-text',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
})
export class IInputText implements ControlValueAccessor {
  @Input() label = 'Label';
  @Input() type: string = 'text';
  @Input() id?: string;
  @Input() fluid = false;
  @Input() forceFloated = false;
  @Input() hideText = false;
  @Input() useFloatLabel = true;
  @Input() placeholder?: string;
  @Input() externalInvalid = false; // Allow parent to override validation state
  @Input() externalErrorMessage?: string; // Allow parent to provide error message
  @Input() backgroundStyle: 'surface' | 'component' = 'surface';
  @Input() icon?: string;
  @Input() readonly = false;

  value: string | null = null;
  @Input() disabled = false; // allow external disabling

  componentId = UniqueComponentId('i-input-text');

  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @Input() errorMessages: { [key: string]: string } = {};

  writeValue(obj: string | null): void {
    this.value = obj == null ? null : obj;
  }
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  touch() {
    this.onTouched();
  }

  get control(): AbstractControl | null {
    return this.ngControl ? this.ngControl.control : null;
  }

  get showErrors(): boolean {
    if (this.externalInvalid) return true;
    const c = this.control;
    return !!(c && c.invalid && c.dirty);
  }

  get firstErrorKey(): string | null {
    const c = this.control;
    if (!c || !c.errors) return null;
    return Object.keys(c.errors)[0] || null;
  }

  getErrorMessage(): string | null {
    if (this.externalInvalid && this.externalErrorMessage) {
      return this.externalErrorMessage;
    }

    const key = this.firstErrorKey;
    if (!key) return null;
    const c = this.control;
    if (this.errorMessages && this.errorMessages[key])
      return this.errorMessages[key];
    const err = c?.errors || {};
    switch (key) {
      case 'required':
        return `${this.label} is required`;
      case 'minlength':
        return `Minimum ${err['minlength']?.requiredLength} characters required`;
      case 'maxlength':
        return `Maximum ${err['maxlength']?.requiredLength} characters allowed`;
      case 'pattern':
        return `${this.label} is not valid`;
      default:
        return err[key] && typeof err[key] === 'string'
          ? err[key]
          : 'Invalid value';
    }
  }
}
