import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IRadioButton } from './radio-button.component';

describe('IRadioButton', () => {
  let component: IRadioButton;
  let fixture: ComponentFixture<IRadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IRadioButton, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IRadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.fluid).toBe(false);
      expect(component.checked).toBe(false);
    });

    it('should accept label input', () => {
      component.label = 'Test Label';
      fixture.detectChanges();
      expect(component.label).toBe('Test Label');
    });

    it('should accept value input', () => {
      component.value = 'option1';
      fixture.detectChanges();
      expect(component.value).toBe('option1');
    });

    it('should accept name input', () => {
      component.name = 'testGroup';
      fixture.detectChanges();
      expect(component.name).toBe('testGroup');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept fluid input', () => {
      component.fluid = true;
      fixture.detectChanges();
      expect(component.fluid).toBe(true);
    });
  });

  describe('Selection functionality', () => {
    it('should select when clicked and not disabled', () => {
      component.value = 'test';
      component.select();
      expect(component.checked).toBe(true);
    });

    it('should not select when disabled', () => {
      component.disabled = true;
      component.value = 'test';
      component.select();
      expect(component.checked).toBe(false);
    });

    it('should emit onChange event', (done) => {
      component.value = 'test';
      component.onChange.subscribe((value: any) => {
        expect(value).toBe('test');
        done();
      });
      component.select();
    });

    it('should not emit onChange when already selected', () => {
      component.value = 'test';
      component.writeValue('test');
      const spy = jasmine.createSpy('onChange');
      component.onChange.subscribe(spy);
      component.select();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value and update checked state', () => {
      component.value = 'option1';
      component.writeValue('option1');
      expect(component.checked).toBe(true);
    });

    it('should not be checked when writeValue does not match', () => {
      component.value = 'option1';
      component.writeValue('option2');
      expect(component.checked).toBe(false);
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.value = 'test';
      component.select();
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.value = 'test';
      component.select();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-radio-button');
    });

    it('should use custom inputId when provided', () => {
      component.inputId = 'custom-radio';
      fixture.detectChanges();
      expect(component.effectiveInputId).toBe('custom-radio');
    });

    it('should use componentId when inputId is not provided', () => {
      component.inputId = undefined;
      expect(component.effectiveInputId).toBe(component.componentId);
    });
  });
});
