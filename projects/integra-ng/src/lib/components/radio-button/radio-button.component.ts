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

/**
 * RadioButton Component
 *
 * A form control radio button component for single selection within a group.
 * Fully compatible with Angular Reactive Forms and Template-driven Forms.
 *
 * @example
 * ```html
 * <!-- Basic radio button -->
 * <i-radio-button label="Option 1" value="option1" name="options"></i-radio-button>
 *
 * <!-- Radio button with ngModel -->
 * <i-radio-button
 *   label="Male"
 *   value="male"
 *   name="gender"
 *   [(ngModel)]="selectedGender">
 * </i-radio-button>
 * <i-radio-button
 *   label="Female"
 *   value="female"
 *   name="gender"
 *   [(ngModel)]="selectedGender">
 * </i-radio-button>
 *
 * <!-- Radio button in reactive form -->
 * <i-radio-button
 *   label="Yes"
 *   value="yes"
 *   name="confirmation"
 *   formControlName="confirmation">
 * </i-radio-button>
 *
 * <!-- Disabled radio button -->
 * <i-radio-button
 *   label="Unavailable"
 *   value="unavailable"
 *   name="options"
 *   [disabled]="true">
 * </i-radio-button>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Radio buttons with the same `name` attribute work as a group, allowing only one selection.
 */
@Component({
  selector: 'i-radio-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IRadioButton),
      multi: true,
    },
  ],
})
export class IRadioButton implements ControlValueAccessor {
  /**
   * Label text displayed next to the radio button
   */
  @Input() label?: string;

  /**
   * The value of this radio option
   */
  @Input() value: any;

  /**
   * Name attribute to group radio buttons
   */
  @Input() name?: string;

  /**
   * HTML id attribute for the radio input element
   */
  @Input() inputId?: string;

  /**
   * Whether the radio button is disabled
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the radio button should take full width
   * @default false
   */
  @Input() fluid = false;

  /**
   * Event emitted when radio button is selected
   */
  @Output() onChange = new EventEmitter<any>();

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-radio-button-');

  /**
   * Internal model value (the selected value in the group)
   * @internal
   */
  private _modelValue: any;

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChangeCallback: (value: any) => void = () => {};

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onTouchedCallback: () => void = () => {};

  /**
   * Gets the effective input ID
   */
  get effectiveInputId(): string {
    return this.inputId || this.componentId;
  }

  /**
   * Checks if this radio button is currently selected
   */
  get checked(): boolean {
    return this._modelValue === this.value;
  }

  /**
   * Selects this radio button
   * @internal
   */
  select(): void {
    if (this.disabled) return;

    if (this._modelValue !== this.value) {
      this._modelValue = this.value;
      this.onChangeCallback(this.value);
      this.onTouchedCallback();

      // Emit after the current change detection cycle completes
      // This ensures Angular forms have processed the value change
      setTimeout(() => {
        this.onChange.emit(this.value);
      }, 0);
    }
  }

  /**
   * Writes a value to the radio button (ControlValueAccessor)
   * @internal
   */
  writeValue(value: any): void {
    this._modelValue = value;
  }

  /**
   * Registers the onChange callback (ControlValueAccessor)
   * @internal
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  /**
   * Registers the onTouched callback (ControlValueAccessor)
   * @internal
   */
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  /**
   * Sets the disabled state (ControlValueAccessor)
   * @internal
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
