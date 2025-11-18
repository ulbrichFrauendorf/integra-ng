import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  IDynamicDialogConfig,
  IDynamicDialogRef,
} from './services/dialog.interfaces';

/**
 * Base component for creating custom dialogs.
 * Extend this component to create your own dialog components with guaranteed access to dialogRef and config.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-my-dialog',
 *   template: `
 *     <div>{{ getData()?.message }}</div>
 *     <button (click)="close()">Close</button>
 *     <button (click)="close('confirmed')">Confirm</button>
 *   `
 * })
 * export class MyDialogComponent extends BaseDialogComponent {
 *   override ngOnInit(): void {
 *     super.ngOnInit();
 *     // Your initialization code here
 *     console.log('Dialog data:', this.getData());
 *   }
 * }
 * ```
 */
@Component({
  template: '', // This is abstract, no template needed
})
export abstract class IDialogBase implements OnInit, AfterViewInit {
  /**
   * Reference to the dialog instance. Use this to close the dialog.
   */
  public dialogRef?: IDynamicDialogRef;

  /**
   * Configuration object containing dialog settings and data.
   */
  public config: IDynamicDialogConfig = {};

  constructor() {}

  ngOnInit(): void {
    // Initialize with empty objects to prevent errors
    this.initializeDialogProperties();
  }

  ngAfterViewInit(): void {
    // Double-check properties after view init in case they were set later
    this.initializeDialogProperties();
  }

  /**
   * Initialize dialog properties from the component instance
   */
  private initializeDialogProperties(): void {
    // Ensure we have at least empty objects to prevent errors
    if (!this.config) {
      this.config = {};
    }

    // Log warning if dialogRef is still not available after AfterViewInit
    if (!this.dialogRef && typeof window !== 'undefined') {
      // Only show warning in browser environment and after a small delay
      setTimeout(() => {
        if (!this.dialogRef) {
          console.warn(
            'BaseDialogComponent: dialogRef is not available. Dialog may not close properly.'
          );
        }
      }, 100);
    }
  }

  /**
   * Close the dialog with an optional result
   * @param result Optional result to pass back to the caller
   */
  protected close(result?: any): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else {
      console.error(
        'BaseDialogComponent: Cannot close dialog - dialogRef is not available'
      );
    }
  }

  /**
   * Get data passed to the dialog
   * @returns The data object or undefined if no data was passed
   */
  protected getData<T = any>(): T | undefined {
    return this.config?.data as T;
  }

  /**
   * Get a specific property from the dialog data
   * @param key The key to retrieve from the data object
   * @returns The value or undefined if not found
   */
  protected getDataProperty<T = any>(key: string): T | undefined {
    return this.config?.data?.[key] as T;
  }

  /**
   * Check if the dialog has specific data
   * @param key Optional key to check for specific property
   * @returns True if data exists (and optionally if the key exists)
   */
  protected hasData(key?: string): boolean {
    if (!this.config?.data) {
      return false;
    }

    if (key) {
      return key in this.config.data;
    }

    return true;
  }
}
