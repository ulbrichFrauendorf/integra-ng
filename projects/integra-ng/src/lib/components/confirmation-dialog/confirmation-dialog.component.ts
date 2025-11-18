import { Component, signal, OnInit } from '@angular/core';
import {
  IDynamicDialogConfig,
  IDynamicDialogRef,
} from '../dialog/services/dialog.interfaces';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { IDialogActions } from '../dialog/inner/dialog-actions/dialog-actions.component';
import { ISeverity } from '@shared/enums/IButtonSeverity';

@Component({
  selector: 'i-confirmation-dialog',
  imports: [IDialogActions],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnInit {
  public dialogRef?: IDynamicDialogRef;
  public config: IDynamicDialogConfig = {};

  componentId = UniqueComponentId('i-confirmation-dialog-');

  severity = signal<ISeverity>('primary');
  message = signal('');
  header = signal('Are you sure?');
  acceptLabel: string = 'Confirm';
  rejectLabel: string = 'Cancel';

  ngOnInit() {
    this.message.set(this.config.data?.message || '');
    this.header.set(this.config.data?.header || 'Are you sure?');
    this.severity.set(this.config.data?.severity || 'primary');
  }

  onConfirm() {
    this.dialogRef?.close(true);
  }

  onCancel() {
    this.dialogRef?.close(false);
  }
}
