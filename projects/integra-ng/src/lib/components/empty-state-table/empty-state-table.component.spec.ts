import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateTableComponent } from './empty-state-table.component';
import { signal } from '@angular/core';

describe('EmptyStateTableComponent', () => {
  let component: EmptyStateTableComponent;
  let fixture: ComponentFixture<EmptyStateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.imageLoaded).toBe(false);
    });

    it('should accept colorScheme signal input', () => {
      const colorScheme = signal('dark');
      component.colorScheme = colorScheme;
      fixture.detectChanges();
      expect(component.colorScheme()).toBe('dark');
    });
  });

  describe('Image loading', () => {
    it('should set imageLoaded to true after delay', (done) => {
      expect(component.imageLoaded).toBe(false);
      component.onImageLoad();

      setTimeout(() => {
        expect(component.imageLoaded).toBe(true);
        done();
      }, 250);
    });
  });
});
