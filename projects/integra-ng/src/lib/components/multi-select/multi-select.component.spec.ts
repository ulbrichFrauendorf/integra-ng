import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IMultiSelect, MultiSelectOption } from './multi-select.component';
import { signal } from '@angular/core';

describe('IMultiSelect', () => {
  let component: IMultiSelect;
  let fixture: ComponentFixture<IMultiSelect>;

  const mockOptions: MultiSelectOption[] = [
    { id: 1, name: 'Option 1', label: 'First Option' },
    { id: 2, name: 'Option 2', label: 'Second Option' },
    { id: 3, name: 'Option 3', label: 'Third Option' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IMultiSelect, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IMultiSelect);
    component = fixture.componentInstance;
    component.options = signal(mockOptions);
    component.optionLabel = 'label';
    component.optionValue = 'id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Multi Select');
      expect(component.placeholder).toBe('Select options');
      expect(component.fluid).toBe(false);
      expect(component.showClear).toBe(false);
      expect(component.filter).toBe(true);
      expect(component.maxSelectedLabels).toBe(3);
      expect(component.selectedItemsLabel).toBe('{0} items selected');
      expect(component.disabled).toBe(false);
      expect(component.readonly).toBe(true);
    });

    it('should accept options signal', () => {
      const newOptions = [{ id: 4, label: 'New Option' }];
      component.options = signal(newOptions);
      fixture.detectChanges();
      expect(component.options()).toEqual(newOptions);
    });
  });

  describe('Dropdown functionality', () => {
    it('should toggle dropdown', () => {
      expect(component.isOpen).toBe(false);
      component.toggleDropdown();
      expect(component.isOpen).toBe(true);
      component.toggleDropdown();
      expect(component.isOpen).toBe(false);
    });
  });

  describe('Option selection', () => {
    it('should select multiple options', () => {
      component.toggleOption(mockOptions[0]);
      component.toggleOption(mockOptions[1]);
      expect(component.value.length).toBe(2);
      expect(component.value).toContain(mockOptions[0].id);
      expect(component.value).toContain(mockOptions[1].id);
    });

    it('should deselect an option', () => {
      component.value = [mockOptions[0].id, mockOptions[1].id];
      component.toggleOption(mockOptions[0]);
      expect(component.value.length).toBe(1);
      expect(component.value).not.toContain(mockOptions[0].id);
    });

    it('should emit onChange event on toggle', () => {
      spyOn(component.onChange, 'emit');
      component.toggleOption(mockOptions[0]);
      expect(component.onChange.emit).toHaveBeenCalledWith([mockOptions[0].id]);
    });

    it('should store full objects when optionValue is not provided', () => {
      component.optionValue = undefined;
      component.toggleOption(mockOptions[0]);
      expect(component.value[0]).toEqual(mockOptions[0]);
    });
  });

  describe('Selected item display', () => {
    it('should display comma-separated labels when under maxSelectedLabels', () => {
      component.value = [mockOptions[0].id, mockOptions[1].id];
      const display = component.getDisplayLabel();
      expect(display).toContain('First Option');
      expect(display).toContain('Second Option');
    });

    it('should display item count when exceeding maxSelectedLabels', () => {
      component.maxSelectedLabels = 2;
      component.value = [mockOptions[0].id, mockOptions[1].id, mockOptions[2].id];
      const display = component.getDisplayLabel();
      expect(display).toBe('3 items selected');
    });

    it('should return empty string when no selection', () => {
      component.value = [];
      expect(component.getDisplayLabel()).toBe('');
    });
  });

  describe('Clear functionality', () => {
    it('should clear all selections', () => {
      component.value = [mockOptions[0].id, mockOptions[1].id];
      component.clearSelection();
      expect(component.value).toEqual([]);
    });

    it('should emit onClear event', () => {
      spyOn(component.onClear, 'emit');
      component.clearSelection();
      expect(component.onClear.emit).toHaveBeenCalled();
    });
  });

  describe('Remove selected item', () => {
    it('should remove specific item from selection', () => {
      component.value = [mockOptions[0].id, mockOptions[1].id];
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');
      
      component.removeSelectedItem(mockOptions[0].id, mockEvent);
      
      expect(component.value.length).toBe(1);
      expect(component.value).not.toContain(mockOptions[0].id);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Option state', () => {
    it('should identify selected options', () => {
      component.value = [mockOptions[0].id];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });
  });

  describe('Filtering', () => {
    it('should filter options by search text', () => {
      component.filterValue.set('first');
      fixture.detectChanges();
      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toContain('First');
    });

    it('should show all options when filter is empty', () => {
      component.filterValue.set('');
      fixture.detectChanges();
      expect(component.filteredOptions().length).toBe(mockOptions.length);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value', () => {
      const values = [mockOptions[0].id, mockOptions[1].id];
      component.writeValue(values);
      expect(component.value).toEqual(values);
    });

    it('should handle null write value', () => {
      component.writeValue(null);
      expect(component.value).toEqual([]);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.toggleOption(mockOptions[0]);
      expect(fn).toHaveBeenCalled();
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.toggleOption(mockOptions[0]);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should show errors when control is invalid and dirty', () => {
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.showErrors).toBe(true);
    });

    it('should get error message for required field', () => {
      component.label = 'Tags';
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      expect(component.getErrorMessage()).toBe('Tags is required');
    });
  });

  describe('Edge cases', () => {
    it('should handle null options array', () => {
      component.options = signal(null);
      fixture.detectChanges();
      expect(component.filteredOptions()).toEqual([]);
    });

    it('should handle undefined options array', () => {
      component.options = signal(undefined);
      fixture.detectChanges();
      expect(component.filteredOptions()).toEqual([]);
    });
  });
});
