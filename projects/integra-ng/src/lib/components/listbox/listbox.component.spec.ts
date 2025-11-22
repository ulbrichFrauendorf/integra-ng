import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IListbox, ListboxOption } from './listbox.component';
import { signal } from '@angular/core';

describe('IListbox', () => {
  let component: IListbox;
  let fixture: ComponentFixture<IListbox>;

  const mockOptions: ListboxOption[] = [
    { id: 1, name: 'Option 1', label: 'First Option' },
    { id: 2, name: 'Option 2', label: 'Second Option' },
    { id: 3, name: 'Option 3', label: 'Third Option' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IListbox, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IListbox);
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
      expect(component.label).toBe('List Box');
      expect(component.fluid).toBe(false);
      expect(component.showClear).toBe(false);
      expect(component.filter).toBe(true);
      expect(component.maxSelectedLabels).toBe(3);
      expect(component.disabled).toBe(false);
      expect(component.multiple).toBe(true);
      expect(component.readonly).toBe(true);
    });

    it('should accept multiple input', () => {
      component.multiple = false;
      fixture.detectChanges();
      expect(component.multiple).toBe(false);
    });
  });

  describe('Multiple selection mode', () => {
    beforeEach(() => {
      component.multiple = true;
    });

    it('should select multiple options', () => {
      component.toggleOption(mockOptions[0]);
      component.toggleOption(mockOptions[1]);
      expect(Array.isArray(component.value)).toBe(true);
      expect(component.value.length).toBe(2);
    });

    it('should deselect an option', () => {
      component.value = [mockOptions[0].id, mockOptions[1].id];
      component.toggleOption(mockOptions[0]);
      expect(component.value.length).toBe(1);
      expect(component.value).not.toContain(mockOptions[0].id);
    });

    it('should clear all selections', () => {
      component.value = [mockOptions[0].id, mockOptions[1].id];
      component.clearSelection();
      expect(component.value).toEqual([]);
    });
  });

  describe('Single selection mode', () => {
    beforeEach(() => {
      component.multiple = false;
    });

    it('should select single option', () => {
      component.toggleOption(mockOptions[0]);
      expect(component.value).toBe(mockOptions[0].id);
    });

    it('should deselect option on second click', () => {
      component.value = mockOptions[0].id;
      component.toggleOption(mockOptions[0]);
      expect(component.value).toBeNull();
    });

    it('should clear selection', () => {
      component.value = mockOptions[0].id;
      component.clearSelection();
      expect(component.value).toBeNull();
    });
  });

  describe('Display functionality', () => {
    it('should show comma-separated labels in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0].id, mockOptions[1].id];
      const display = component.getDisplayLabel();
      expect(display).toContain('First Option');
      expect(display).toContain('Second Option');
    });

    it('should show item count when exceeding maxSelectedLabels', () => {
      component.multiple = true;
      component.maxSelectedLabels = 2;
      component.value = [mockOptions[0].id, mockOptions[1].id, mockOptions[2].id];
      const display = component.getDisplayLabel();
      expect(display).toBe('3 items selected');
    });

    it('should show single label in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0].id;
      const display = component.getDisplayLabel();
      expect(display).toBe('First Option');
    });

    it('should return empty string when no selection', () => {
      component.multiple = true;
      component.value = [];
      expect(component.getDisplayLabel()).toBe('');
    });
  });

  describe('Remove selected item', () => {
    it('should remove item in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0].id, mockOptions[1].id];
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');
      
      component.removeSelectedItem(mockOptions[0].id, mockEvent);
      
      expect(component.value.length).toBe(1);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should clear value in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0].id;
      const mockEvent = new Event('click');
      
      component.removeSelectedItem(mockOptions[0].id, mockEvent);
      expect(component.value).toBeNull();
    });
  });

  describe('Option state', () => {
    it('should identify selected options in multiple mode', () => {
      component.multiple = true;
      component.value = [mockOptions[0].id];
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });

    it('should identify selected option in single mode', () => {
      component.multiple = false;
      component.value = mockOptions[0].id;
      expect(component.isOptionSelected(mockOptions[0])).toBe(true);
      expect(component.isOptionSelected(mockOptions[1])).toBe(false);
    });
  });

  describe('Helper methods', () => {
    it('should detect if has value in multiple mode', () => {
      component.multiple = true;
      component.value = [];
      expect(component.hasValue()).toBe(false);
      component.value = [mockOptions[0].id];
      expect(component.hasValue()).toBe(true);
    });

    it('should detect if has value in single mode', () => {
      component.multiple = false;
      component.value = null;
      expect(component.hasValue()).toBe(false);
      component.value = mockOptions[0].id;
      expect(component.hasValue()).toBe(true);
    });

    it('should determine if should show chips', () => {
      component.multiple = true;
      component.maxSelectedLabels = 3;
      component.value = [mockOptions[0].id];
      expect(component.shouldShowChips()).toBe(true);
    });

    it('should get correct placeholder', () => {
      component.multiple = true;
      expect(component.getPlaceholder()).toBe('Select options');
      component.multiple = false;
      expect(component.getPlaceholder()).toBe('Select an option');
    });
  });

  describe('Filtering', () => {
    it('should filter options by search text', () => {
      component.filterValue.set('first');
      fixture.detectChanges();
      const filtered = component.filteredOptions();
      expect(filtered.length).toBe(1);
    });

    it('should show all options when filter is empty', () => {
      component.filterValue.set('');
      fixture.detectChanges();
      expect(component.filteredOptions().length).toBe(mockOptions.length);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value in multiple mode', () => {
      component.multiple = true;
      const values = [mockOptions[0].id, mockOptions[1].id];
      component.writeValue(values);
      expect(component.value).toEqual(values);
    });

    it('should write value in single mode', () => {
      component.multiple = false;
      component.writeValue(mockOptions[0].id);
      expect(component.value).toBe(mockOptions[0].id);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
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
  });

  describe('Edge cases', () => {
    it('should handle null options array', () => {
      component.options = signal(null);
      fixture.detectChanges();
      expect(component.filteredOptions()).toEqual([]);
    });
  });
});
