import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IInputText } from './input-text.component';
import { NgControl } from '@angular/forms';

describe('IInputText', () => {
  let component: IInputText;
  let fixture: ComponentFixture<IInputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IInputText, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IInputText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Label');
      expect(component.type).toBe('text');
      expect(component.fluid).toBe(false);
      expect(component.forceFloated).toBe(false);
      expect(component.hideText).toBe(false);
      expect(component.useFloatLabel).toBe(true);
      expect(component.externalInvalid).toBe(false);
      expect(component.backgroundStyle).toBe('surface');
      expect(component.readonly).toBe(false);
      expect(component.disabled).toBe(false);
    });

    it('should accept label input', () => {
      component.label = 'Username';
      fixture.detectChanges();
      expect(component.label).toBe('Username');
    });

    it('should accept type input', () => {
      component.type = 'password';
      fixture.detectChanges();
      expect(component.type).toBe('password');
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-search';
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-search');
    });

    it('should accept readonly input', () => {
      component.readonly = true;
      fixture.detectChanges();
      expect(component.readonly).toBe(true);
    });

    it('should accept backgroundStyle input', () => {
      component.backgroundStyle = 'component';
      fixture.detectChanges();
      expect(component.backgroundStyle).toBe('component');
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should write value', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.value).toBeNull();
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      
      const mockEvent = { target: { value: 'new value' } } as any;
      component.handleInput(mockEvent);
      
      expect(fn).toHaveBeenCalledWith('new value');
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.touch();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Input handling', () => {
    it('should update value on input', () => {
      const mockEvent = { target: { value: 'typed value' } } as any;
      component.handleInput(mockEvent);
      expect(component.value).toBe('typed value');
    });
  });

  describe('Validation and errors', () => {
    it('should show errors when externalInvalid is true', () => {
      component.externalInvalid = true;
      expect(component.showErrors).toBe(true);
    });

    it('should display external error message', () => {
      component.externalInvalid = true;
      component.externalErrorMessage = 'Custom error';
      expect(component.getErrorMessage()).toBe('Custom error');
    });

    it('should generate default required error message', () => {
      component.label = 'Email';
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      
      expect(component.getErrorMessage()).toBe('Email is required');
    });

    it('should handle custom error messages', () => {
      component.errorMessages = { required: 'This field cannot be empty' };
      component.ngControl = {
        control: {
          invalid: true,
          dirty: true,
          errors: { required: true },
        },
      } as any;
      
      expect(component.getErrorMessage()).toBe('This field cannot be empty');
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-input-text');
    });

    it('should use custom id when provided', () => {
      component.id = 'custom-input';
      fixture.detectChanges();
      expect(component.id).toBe('custom-input');
    });
  });
});
