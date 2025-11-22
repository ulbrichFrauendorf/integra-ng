import { Observable } from 'rxjs';
import { AbstractDialog } from '../dialog-base';

/**
 * Configuration options for dynamically created dialogs.
 */
export interface IDynamicDialogConfig {
  /** The header text displayed in the dialog title bar */
  header?: string;

  /** The message content to display (if applicable) */
  message?: string;

  /** The width of the dialog. Can be any valid CSS width value (e.g., '500px', '50vw'). Defaults to '300px' */
  width?: string;

  /** The height of the dialog. Can be any valid CSS height value (e.g., '400px', '50vh') */
  height?: string;

  /** Custom CSS styles to apply to the dialog content container */
  contentStyle?: { [key: string]: any };

  /**
   * Responsive breakpoints for dialog width at different screen sizes.
   * @example
   * ```typescript
   * breakpoints: {
   *   '960px': '75vw',
   *   '640px': '90vw'
   * }
   * ```
   */
  breakpoints?: { [key: string]: string };

  /** Whether the dialog can be closed via the close button, ESC key, or overlay click. Defaults to true */
  closable?: boolean;

  /** Whether to display a modal overlay behind the dialog. Defaults to true */
  modal?: boolean;

  /** Custom data to pass to the component rendered inside the dialog */
  data?: any;
}

/**
 * Reference object for controlling a dynamically created dialog.
 * Provides methods to close the dialog and observe its lifecycle.
 */
export interface IDynamicDialogRef {
  /**
   * Closes the dialog and optionally returns a result.
   * @param result Optional result data to pass to onClose subscribers
   */
  close(result?: any): void;

  /** Observable that emits when the dialog is closed, providing the close result if any */
  onClose: Observable<any>;

  /** Reference to the dialog component instance */
  instance?: AbstractDialog;
}
