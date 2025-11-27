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
  AfterViewChecked,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import {
  IChipsComponent,
  ChipItem,
  ChipRemoveEvent,
} from '../chips/chips.component';
import { ICheckbox } from '../checkbox/checkbox.component';
import { IInputText } from '../input-text/input-text.component';
import { IButton } from '../button/button.component';
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
 *   title="Choose One"
 *   [options]="items"
 *   optionLabel="name"
 *   optionValue="id"
 *   [multiple]="false"
 *   formControlName="selectedItem">
 * </i-listbox>
 *
 * <!-- Multiple selection listbox with action button -->
 * <i-listbox
 *   title="Choose Multiple"
 *   [options]="items"
 *   optionLabel="name"
 *   optionValue="id"
 *   [multiple]="true"
 *   actionIcon="pi pi-plus"
 *   actionTooltip="Add new item"
 *   (onAction)="addItem()"
 *   formControlName="selectedItems">
 * </i-listbox>
 *
 * <!-- Listbox with option icons -->
 * <i-listbox
 *   title="Select Items"
 *   [options]="items"
 *   optionLabel="name"
 *   optionValue="id"
 *   optionLeftIcon="icon"
 *   optionRightIcon="statusIcon"
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
  imports: [
    CommonModule,
    FormsModule,
    IChipsComponent,
    ICheckbox,
    IInputText,
    IButton,
  ],
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
export class IListbox implements ControlValueAccessor, AfterViewChecked {
  /**
   * Title text displayed in the listbox header
   * @default 'List Box'
   */
  @Input() title = 'List Box';

  /**
   * @deprecated Use 'title' instead
   */
  @Input() label = '';

  /**
   * Icon class for the action button (e.g., 'pi pi-plus')
   * If provided, an action button will be shown in the header
   */
  @Input() actionIcon?: string;

  /**
   * Tooltip text for the action button
   */
  @Input() actionTooltip?: string;

  /**
   * Property name for left icon on each option
   * The option object should have this property with an icon class string
   */
  @Input() optionLeftIcon?: string;

  /**
   * Property name for right icon on each option
   * The option object should have this property with an icon class string
   */
  @Input() optionRightIcon?: string;

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

  /**
   * Event emitted when the action button is clicked
   */
  @Output() onAction = new EventEmitter<void>();

  @ViewChild('dropdown', { static: false }) dropdownRef!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInputRef!: ElementRef;
  @ViewChild('chipsViewport', { static: false }) chipsViewportRef!: ElementRef;

  // Convert filter value to signal
  filterValue = signal('');

  // Track whether chips overflow their container
  chipsOverflow = signal(false);

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
  }

  /**
   * Gets the effective title (supports legacy 'label' property)
   */
  get effectiveTitle(): string {
    return this.title || this.label || 'List Box';
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

  /**
   * Track previous value length to detect changes
   * @internal
   */
  private previousValueLength = 0;

  constructor(private injector: Injector, private ngZone: NgZone) {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
    });
  }

  /**
   * Check for chips overflow after view updates
   */
  ngAfterViewChecked(): void {
    this.checkChipsOverflow();
  }

  /**
   * Measures if chips overflow their container and updates the signal.
   * Compares total width of all chips against wrapper width minus padding.
   * @internal
   */
  private checkChipsOverflow(): void {
    if (!this.chipsViewportRef?.nativeElement) return;

    const viewport = this.chipsViewportRef.nativeElement as HTMLElement;

    // Force layout before measuring to ensure scrollWidth is up to date
    viewport.style.removeProperty('width');
    const computedStyle = getComputedStyle(
      this.dropdownRef?.nativeElement ?? viewport
    );
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const wrapperWidth = this.dropdownRef?.nativeElement
      ? this.dropdownRef.nativeElement.getBoundingClientRect().width
      : viewport.getBoundingClientRect().width;
    const availableWidth = Math.max(
      wrapperWidth - paddingLeft - paddingRight,
      0
    );
    viewport.style.width = `${availableWidth}px`;

    const isOverflowing = viewport.scrollWidth > viewport.clientWidth;

    if (this.chipsOverflow() !== isOverflowing) {
      this.ngZone.run(() => this.chipsOverflow.set(isOverflowing));
    }
  }

  /**
   * Handles action button click
   */
  onActionClick(event: Event): void {
    event.stopPropagation();
    this.onAction.emit();
  }

  /**
   * Gets the left icon for an option
   */
  getOptionLeftIcon(option: ListboxOption): string | null {
    if (!this.optionLeftIcon) return null;
    return option[this.optionLeftIcon] || null;
  }

  /**
   * Gets the right icon for an option
   */
  getOptionRightIcon(option: ListboxOption): string | null {
    if (!this.optionRightIcon) return null;
    return option[this.optionRightIcon] || null;
  }

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

  getSelectedChipItems(): ChipItem[] {
    const labels = this.getSelectedLabels();
    const values = this.getValueArray();

    return values.map((value, index) => ({
      label: labels[index] ?? String(value),
      value,
      removable: !this.disabled,
    }));
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

  /**
   * Determines if chips should be shown or if summary text should display.
   * Returns true if:
   * - Multiple mode is enabled
   * - There are selected values
   * - Chips don't overflow their container (dynamically measured)
   */
  shouldShowChips(): boolean {
    if (!this.multiple) return false;

    return (
      Array.isArray(this.value) &&
      this.value.length > 0 &&
      !this.chipsOverflow()
    );
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

  onChipRemove(event: ChipRemoveEvent): void {
    this.removeSelectedItem(event.chip.value, event.originalEvent);
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
  }

  registerOnChange(fn: (value: any[] | any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
        return `${this.effectiveTitle} is required`;
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
