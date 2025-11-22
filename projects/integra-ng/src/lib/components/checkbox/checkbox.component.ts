import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

@Component({
  selector: 'i-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ICheckbox),
      multi: true,
    },
  ],
})
export class ICheckbox implements ControlValueAccessor {
  @Input() label?: string;
  @Input() id?: string;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() indeterminate = false; // visual tri-state support

  @Input()
  set checked(value: boolean) {
    this._checked = !!value;
  }
  get checked(): boolean {
    return this._checked;
  }

  @Output() onChange = new EventEmitter<boolean>();

  componentId = UniqueComponentId('i-checkbox');

  private _checked = false;
  private onChangeCallback: (value: boolean) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  toggle() {
    if (this.disabled || this.readonly) return;
    // When indeterminate, clicking should uncheck everything (parent and all children)
    if (this.indeterminate) {
      this.indeterminate = false;
      this._checked = false;
    } else {
      // Normal toggle behavior when not indeterminate
      this._checked = !this._checked;
    }
    this.onChangeCallback(this._checked);
    this.onTouchedCallback();

    // Emit onChange after the ngModel has been updated
    setTimeout(() => {
      this.onChange.emit(this._checked);
    }, 0);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this._checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
