import { Observable } from 'rxjs';
import { AbstractDialog } from '../dialog-base';

export interface IDynamicDialogConfig {
  header?: string;
  message?: string;
  width?: string;
  height?: string;
  contentStyle?: { [key: string]: any };
  breakpoints?: { [key: string]: string };
  closable?: boolean;
  modal?: boolean;
  data?: any;
}

export interface IDynamicDialogRef {
  close(result?: any): void;
  onClose: Observable<any>;
  instance?: AbstractDialog;
}
