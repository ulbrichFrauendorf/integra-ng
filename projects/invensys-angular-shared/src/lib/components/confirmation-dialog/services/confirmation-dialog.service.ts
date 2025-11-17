import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { DialogService } from '../../dialog/services/dialog.service';
import { IDynamicDialogRef } from '../../dialog/services/dialog.interfaces';
import { ISeverity } from '@shared/enums/IButtonSeverity';

export interface ConfirmationDialogConfig {
  severity?: ISeverity;
  message: string;
  header?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept?: () => void;
  reject?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialogService: DialogService) {}

  acceptLabel?: string;
  rejectLabel?: string;

  async confirm(config: ConfirmationDialogConfig): Promise<IDynamicDialogRef> {
    const { ConfirmationDialogComponent } = await import(
      '../confirmation-dialog.component'
    );

    this.acceptLabel = config.acceptLabel || 'Confirm';
    this.rejectLabel = config.rejectLabel || 'Cancel';

    const ref = this.dialogService.open(ConfirmationDialogComponent, {
      header: config.header,
      width: '400px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        message: config.message,
        header: config.header,
        severity: config.severity || 'primary',
      },
    });

    // Subscribe to dialog close event to execute callbacks
    ref.onClose.pipe(take(1)).subscribe((result: boolean) => {
      if (result === true && config.accept) {
        config.accept();
      } else if (result === false && config.reject) {
        config.reject();
      }
    });

    return ref;
  }
}
