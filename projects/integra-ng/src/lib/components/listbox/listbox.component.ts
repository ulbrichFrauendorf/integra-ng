import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
  forwardRef,
  Injector,
  signal,
  computed,
  InputSignal,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import { IInputText } from '../input-text/input-text.component';
import { IChip } from '../chip/chip.component';
import { ICheckbox } from '../checkbox/checkbox.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';

/**
 * Option data structure for the listbox component
 */
export interface ListboxOption {
  [key: string]: any;
}

/**
 * Listbox Component
 *
 * A versatile listbox component supporting both single and multiple selection modes.
 * Features filtering, chips display, and full form control integration.
 * Uses Angular signals for reactive state management.
 *
 * @example
 * ```html
 * <!-- Single selection listbox -->
 * <i-listbox
 *   label="Choose One"
 *   [options]="items"
 *   optionLabel="name"
 *   optionValue="id"
 *   [multiple]="false"
 *   formControlName="selectedItem">
 * </i-listbox>
 *
 * <!-- Multiple selection listbox -->
 * <i-listbox
 *   label="Choose Multiple"
 *   [options]="items"
 *   optionLabel="name"
 *   optionValue="id"
 *   [multiple]="true"
 *   formControlName="selectedItems">
 * </i-listbox>
 *
 * <!-- Listbox with filtering -->
 * <i-listbox
 *   label="Search and Select"
 *   [options]="items"
 *   optionLabel="name"
 *   optionValue="id"
 *   [filter]="true"
 *   filterBy="name"
 *   formControlName="selection">
 * </i-listbox>
 * ```
 *
 * @remarks
 * This component implements ControlValueAccessor for seamless integration with Angular Forms.
 * Supports both single and multiple selection modes.
 * Uses signals for efficient filtering and option management.
 */
@Component({
  selector: 'i-listbox',
  standalone: true,
  imports: [CommonModule, FormsModule, IInputText, IChip, ICheckbox],
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IListbox),
      multi: true,
    },
  ],
})
export class IListbox implements ControlValueAccessor {
  /**
   * Label text displayed for the listbox
   * @default 'List Box'
   */
  @Input() label = 'List Box';
  // Convert options to signal input
  options: InputSignal<ListboxOption[] | null | undefined> = input<
    ListboxOption[] | null | undefined
  >([]);
  @Input({ required: true }) optionLabel!: string;
  @Input({ required: true }) optionValue!: string;
  @Input() placeholder?: string;
  @Input() id?: string;
  @Input() fluid = false;
  @Input() showClear = false;
  @Input() filter = true;
  @Input() filterBy = 'label';
  @Input() maxSelectedLabels = 3;
  @Input() selectedItemsLabel = '{0} items selected';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() disabled = false;
  @Input() multiple = true;
  @Input() readonly = true;

  @Output() onChange = new EventEmitter<any[] | any>();
  @Output() onClear = new EventEmitter<void>();

  @ViewChild('inputText') inputTextRef!: IInputText;
  @ViewChild('dropdown', { static: false }) dropdownRef!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInputRef!: ElementRef;

  // Convert filter value to signal
  filterValue = signal('');

  // Create computed signal for filtered options
  filteredOptions = computed(() => {
    const currentOptions = this.options() || [];
    const currentFilterValue = this.filterValue();

    if (!Array.isArray(currentOptions)) {
      return [];
    }

    if (!this.filter || !currentFilterValue.trim()) {
      return [...currentOptions];
    } else {
      const filterText = currentFilterValue.toLowerCase();
      return currentOptions.filter((option) => {
        const searchValue = this.getOptionSearchValue(option).toLowerCase();
        return searchValue.includes(filterText);
      });
    }
  });

  private _value: any[] | any = [];

  get value(): any[] | any {
    return this._value;
  }

  set value(val: any[] | any) {
    if (this.multiple) {
      this._value = val || [];
    } else {
      this._value = val;
    }
    // Update the underlying input-text component through ngModel
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getDisplayLabel() || null;
    }
  }

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onChangeCallback: (value: any[] | any) => void = () => {};

  /**
   * Callback for ControlValueAccessor
   * @internal
   */
  private onTouchedCallback: () => void = () => {};

  /**
   * NgControl reference for form validation
   * @internal
   */
  public ngControl: NgControl | null = null;

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-listbox-');

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
    });
  }

  // This will be bound to the underlying input-text component
  get inputValue(): string {
    return this.getDisplayLabel();
  }

  set inputValue(value: string) {}

  toggleOption(option: ListboxOption) {
    const optionValue = this.getOptionValue(option);

    if (this.multiple) {
      const currentValues = Array.isArray(this.value) ? [...this.value] : [];
      const index = currentValues.findIndex((val) => val === optionValue);

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(optionValue);
      }

      this.value = currentValues;
      this.onChange.emit(currentValues);
      this.onChangeCallback(currentValues);
      this.onTouchedCallback();
    } else {
      const newValue = this.value === optionValue ? null : optionValue;
      this.value = newValue;
      this.onChange.emit(newValue);
      this.onChangeCallback(newValue);
      this.onTouchedCallback();
    }
  }

  isOptionSelected(option: ListboxOption): boolean {
    const optionValue = this.getOptionValue(option);

    if (this.multiple) {
      return Array.isArray(this.value) && this.value.includes(optionValue);
    } else {
      return this.value === optionValue;
    }
  }

  clearSelection() {
    const newValue = this.multiple ? [] : null;
    this.value = newValue;
    this.onClear.emit();
    this.onChangeCallback(newValue);
    this.onTouchedCallback();
  }

  removeSelectedItem(value: any, event: Event) {
    event.stopPropagation();

    if (this.multiple) {
      const currentValues = Array.isArray(this.value) ? [...this.value] : [];
      const index = currentValues.findIndex((val) => val === value);
      if (index > -1) {
        currentValues.splice(index, 1);
        this.value = currentValues;
        this.onChange.emit(currentValues);
        this.onChangeCallback(currentValues);
        this.onTouchedCallback();
      }
    } else {
      if (this.value === value) {
        this.value = null;
        this.onChange.emit(null);
        this.onChangeCallback(null);
        this.onTouchedCallback();
      }
    }
  }

  getOptionLabel(option: ListboxOption): string {
    return option[this.optionLabel] || option['label'] || String(option);
  }

  getOptionValue(option: ListboxOption): any {
    return option[this.optionValue] || option['value'] || option;
  }

  getOptionSearchValue(option: ListboxOption): string {
    if (this.filterBy && option[this.filterBy]) {
      return String(option[this.filterBy]);
    }
    return this.getOptionLabel(option);
  }

  getSelectedLabels(): string[] {
    const currentOptions = this.options() || [];
    if (!Array.isArray(currentOptions)) {
      return [];
    }

    if (!this.multiple) {
      if (this.value === null || this.value === undefined) {
        return [];
      }
      const option = currentOptions.find(
        (opt: ListboxOption) => this.getOptionValue(opt) === this.value
      );
      return option ? [this.getOptionLabel(option)] : [String(this.value)];
    }

    const values = Array.isArray(this.value) ? this.value : [];
    return values.map((val: any) => {
      const option = currentOptions.find(
        (opt: ListboxOption) => this.getOptionValue(opt) === val
      );
      return option ? this.getOptionLabel(option) : String(val);
    });
  }

  getDisplayLabel(): string {
    const currentOptions = this.options() || [];
    if (!Array.isArray(currentOptions)) {
      return '';
    }

    if (!this.multiple) {
      if (this.value === null || this.value === undefined) {
        return '';
      }
      const option = currentOptions.find(
        (opt: ListboxOption) => this.getOptionValue(opt) === this.value
      );
      return option ? this.getOptionLabel(option) : String(this.value);
    }

    if (!this.value || (Array.isArray(this.value) && this.value.length === 0)) {
      return '';
    }

    const selectedLabels = this.getSelectedLabels();

    if (selectedLabels.length <= this.maxSelectedLabels) {
      return selectedLabels.join(', ');
    } else {
      return this.selectedItemsLabel.replace(
        '{0}',
        selectedLabels.length.toString()
      );
    }
  }

  trackByValue(index: number, value: any): any {
    return value;
  }

  hasValue(): boolean {
    if (this.multiple) {
      return Array.isArray(this.value) && this.value.length > 0;
    } else {
      return this.value !== null && this.value !== undefined;
    }
  }

  shouldHideText(): boolean {
    if (this.multiple) {
      return this.value.length <= this.maxSelectedLabels;
    } else {
      return true;
    }
  }

  shouldShowChips(): boolean {
    if (this.multiple) {
      return (
        Array.isArray(this.value) &&
        this.value.length > 0 &&
        this.value.length <= this.maxSelectedLabels
      );
    } else {
      return this.hasValue();
    }
  }

  getValueArray(): any[] {
    if (this.multiple) {
      return Array.isArray(this.value) ? this.value : [];
    } else {
      return this.value !== null && this.value !== undefined
        ? [this.value]
        : [];
    }
  }

  getPlaceholder(): string {
    return (
      this.placeholder ||
      (this.multiple ? 'Select options' : 'Select an option')
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.filterValue.set('');
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any[] | any): void {
    if (this.multiple) {
      this._value = value || [];
    } else {
      this._value = value;
    }
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getDisplayLabel() || null;
    }
  }

  registerOnChange(fn: (value: any[] | any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  get control(): AbstractControl | null {
    return this.ngControl ? this.ngControl.control : null;
  }

  get showErrors(): boolean {
    const c = this.control;
    return !!(c && c.invalid && c.dirty);
  }

  get firstErrorKey(): string | null {
    const c = this.control;
    if (!c || !c.errors) return null;
    return Object.keys(c.errors)[0] || null;
  }

  getErrorMessage(): string | null {
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
        return `Minimum ${err['minlength']?.requiredLength} items required`;
      case 'minArrayLength':
        return `Minimum ${err['minArrayLength']?.requiredLength} items required`;
      case 'maxlength':
        return `Maximum ${err['maxlength']?.requiredLength} items allowed`;
      default:
        return err[key] && typeof err[key] === 'string'
          ? err[key]
          : 'Invalid selection';
    }
  }
}
