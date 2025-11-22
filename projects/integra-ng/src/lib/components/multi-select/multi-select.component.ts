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

export interface MultiSelectOption {
  [key: string]: any;
}

@Component({
  selector: 'i-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IInputText, IChip, ICheckbox],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IMultiSelect),
      multi: true,
    },
  ],
})
export class IMultiSelect implements ControlValueAccessor {
  @Input() label = 'Multi Select';
  // Convert options to signal input
  options: InputSignal<MultiSelectOption[] | null | undefined> = input<
    MultiSelectOption[] | null | undefined
  >([]);
  @Input({ required: true }) optionLabel!: string;
  @Input() optionValue?: string;
  @Input() placeholder = 'Select options';
  @Input() id?: string;
  @Input() fluid = false;
  @Input() showClear = false;
  @Input() filter = true;
  @Input() filterBy = 'label';
  @Input() maxSelectedLabels = 3;
  @Input() selectedItemsLabel = '{0} items selected';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() disabled = false;
  @Input() readonly = true;

  @Output() onChange = new EventEmitter<any[]>();
  @Output() onClear = new EventEmitter<void>();

  @ViewChild('inputText') inputTextRef!: IInputText;
  @ViewChild('dropdown', { static: false }) dropdownRef!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInputRef!: ElementRef;

  isOpen = false;
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

  private _value: any[] = [];

  get value(): any[] {
    return this._value;
  }

  set value(val: any[]) {
    this._value = val || [];
    // Update the underlying input-text component through ngModel
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getDisplayLabel() || null;
    }
  }

  // ControlValueAccessor properties
  private onChangeCallback: (value: any[]) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public ngControl: NgControl | null = null;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
    });
  }

  // This will be bound to the underlying input-text component
  get inputValue(): string {
    return this.getDisplayLabel();
  }

  set inputValue(value: string) {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterValue.set('');
      setTimeout(() => {
        if (
          this.filter &&
          this.searchInputRef &&
          this.searchInputRef.nativeElement
        ) {
          this.searchInputRef.nativeElement.focus();
        }
      });
    }
  }

  toggleOption(option: MultiSelectOption) {
    const currentValues = [...this.value];

    if (!this.optionValue) {
      const index = currentValues.findIndex(
        (val) => JSON.stringify(val) === JSON.stringify(option)
      );
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option);
      }
    } else {
      const optionValue = this.getOptionValue(option);
      const index = currentValues.findIndex((val) => val === optionValue);
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(optionValue);
      }
    }

    this.value = currentValues;
    this.onChange.emit(currentValues);
    this.onChangeCallback(currentValues);
    this.onTouchedCallback();
  }

  isOptionSelected(option: MultiSelectOption): boolean {
    if (!this.optionValue) {
      return this.value.some(
        (val) => JSON.stringify(val) === JSON.stringify(option)
      );
    } else {
      const optionValue = this.getOptionValue(option);
      return this.value.includes(optionValue);
    }
  }

  clearSelection() {
    this.value = [];
    this.onClear.emit();
    this.onChangeCallback([]);
    this.onTouchedCallback();
  }

  removeSelectedItem(value: any, event: Event) {
    event.stopPropagation();
    const currentValues = [...this.value];

    let index: number;
    if (!this.optionValue) {
      index = currentValues.findIndex(
        (val) => JSON.stringify(val) === JSON.stringify(value)
      );
    } else {
      index = currentValues.findIndex((val) => val === value);
    }

    if (index > -1) {
      currentValues.splice(index, 1);
      this.value = currentValues;
      this.onChange.emit(currentValues);
      this.onChangeCallback(currentValues);
      this.onTouchedCallback();
    }
  }

  getOptionLabel(option: MultiSelectOption): string {
    return option[this.optionLabel] || option['label'] || String(option);
  }

  getOptionValue(option: MultiSelectOption): any {
    if (!this.optionValue) {
      return option;
    }
    return option[this.optionValue] || option['value'] || option;
  }

  getOptionSearchValue(option: MultiSelectOption): string {
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

    return this.value.map((val) => {
      if (!this.optionValue) {
        return this.getOptionLabel(val);
      } else {
        const option = currentOptions.find(
          (opt: MultiSelectOption) => this.getOptionValue(opt) === val
        );
        return option ? this.getOptionLabel(option) : String(val);
      }
    });
  }

  getDisplayLabel(): string {
    if (!this.value || this.value.length === 0) {
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.isOpen = false;
      this.filterValue.set('');
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any[]): void {
    this._value = value || [];
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getDisplayLabel() || null;
    }
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

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
