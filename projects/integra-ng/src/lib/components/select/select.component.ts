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

export interface SelectOption {
  [key: string]: any;
}

@Component({
  selector: 'i-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IInputText],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ISelect),
      multi: true,
    },
  ],
})
export class ISelect implements ControlValueAccessor {
  @Input() label = 'Select';
  // Convert options to signal input
  options: InputSignal<SelectOption[] | null | undefined> = input<
    SelectOption[] | null | undefined
  >([]);
  @Input({ required: true }) optionLabel!: string;
  @Input() optionValue?: string;
  @Input() placeholder = 'Select an option';
  @Input() id?: string;
  @Input() fluid = false;
  @Input() showClear = false;
  @Input() filter = true;
  @Input() filterBy = 'label';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() readonly = true;

  @Output() onChange = new EventEmitter<any>();
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

  // This will be bound to the underlying input-text component
  get inputValue(): string {
    return this.getSelectedLabel() || '';
  }

  set inputValue(value: string) {
  }

  private _value: any = null;

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    this._value = val;
    // Update the underlying input-text component through ngModel
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getSelectedLabel() || null;
    }
  }

  // ControlValueAccessor properties
  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public ngControl: NgControl | null = null;

  constructor(private injector: Injector) {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
    });
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

  selectOption(option: SelectOption) {
    const newValue = this.getOptionValue(option);
    this.value = newValue;
    this.onChange.emit(newValue);
    this.onChangeCallback(newValue);
    this.onTouchedCallback();
    this.isOpen = false;
    this.filterValue.set('');
  }

  clearSelection() {
    this.value = null;
    this.onClear.emit();
    this.onChangeCallback(null);
    this.onTouchedCallback();
  }

  getOptionLabel(option: SelectOption): string {
    return option[this.optionLabel] || option['label'] || String(option);
  }

  getOptionValue(option: SelectOption): any {
    if (!this.optionValue) {
      return option;
    }
    return option[this.optionValue] || option['value'] || String(option);
  }

  isOptionSelected(option: SelectOption): boolean {
    if (this.value === null || this.value === undefined) {
      return false;
    }

    if (!this.optionValue) {
      return JSON.stringify(option) === JSON.stringify(this.value);
    } else {
      return this.getOptionValue(option) === this.value;
    }
  }

  getOptionSearchValue(option: SelectOption): string {
    if (this.filterBy && option[this.filterBy]) {
      return String(option[this.filterBy]);
    }
    return this.getOptionLabel(option);
  }

  getSelectedLabel(): string {
    if (this.value === null || this.value === undefined) {
      return '';
    }

    const currentOptions = this.options() || [];
    if (!Array.isArray(currentOptions)) {
      return String(this.value);
    }

    const selectedOption = currentOptions.find((option: SelectOption) =>
      this.isOptionSelected(option)
    );

    return selectedOption
      ? this.getOptionLabel(selectedOption)
      : String(this.value);
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
  writeValue(value: any): void {
    this._value = value;
    if (this.inputTextRef) {
      this.inputTextRef.value = this.getSelectedLabel() || null;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
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
      default:
        return err[key] && typeof err[key] === 'string'
          ? err[key]
          : 'Invalid selection';
    }
  }
}
