import { Component, inject } from '@angular/core';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/services/confirmation-dialog.service';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';

@Component({
  selector: 'app-confirmation-dialogs',
  imports: [IButton, DemoCardComponent],
  templateUrl: './confirmation-dialogs.component.html',
  styleUrl: './confirmation-dialogs.component.scss',
})
export class ConfirmationDialogsComponent {
  private confirmationService = inject(ConfirmationDialogService);

  // Code examples organized by category
  codeExamples = {
    basic: `// 1. Import and inject the service
import { ConfirmationDialogService } from '../../../../../invensys-angular-shared/src/lib/components/confirmation-dialog/services/confirmation-dialog.service';

constructor(private confirmationService = inject(ConfirmationDialogService)) {}

// 2. Use in your method
async showConfirmation() {
  await this.confirmationService.confirm({
    message: 'Are you sure you want to delete this item?',
    header: 'Confirm Delete',
    accept: () => {
      console.log('Item deleted');
    },
    reject: () => {
      console.log('Delete cancelled');
    },
  });
}`,

    custom: `await this.confirmationService.confirm({
  message: 'Please confirm if you would like to unlink the report.',
  header: 'Are you sure?',
  acceptLabel: 'Unlink',
  rejectLabel: 'Cancel',
  accept: () => {
    console.log('Unlink confirmed');
  },
  reject: () => {
    console.log('Unlink cancelled');
  },
});`,

    discard: `await this.confirmationService.confirm({
  message: 'You have unsaved changes. Are you sure you want to discard them?',
  header: 'Discard Changes',
  acceptLabel: 'Discard',
  rejectLabel: 'Keep Editing',
  accept: () => {
    console.log('Changes discarded');
  },
  reject: () => {
    console.log('Continue editing');
  },
});`,

    dangerous: `await this.confirmationService.confirm({
  message: 'This action cannot be undone. All data will be permanently deleted.',
  header: 'Permanent Deletion',
  acceptLabel: 'Delete Forever',
  rejectLabel: 'Cancel',
  accept: () => {
    console.log('Permanent deletion confirmed');
  },
  reject: () => {
    console.log('Deletion cancelled');
  },
});`,
  };

  features = [
    {
      title: 'Service-Based',
      description: 'Use ConfirmationDialogService for programmatic dialogs',
    },
    {
      title: 'Custom Labels',
      description: 'Customize accept and reject button text',
    },
    {
      title: 'Action Callbacks',
      description: 'Handle user responses with accept/reject functions',
    },
    {
      title: 'Modal Behavior',
      description: 'Blocks user interaction until decision is made',
    },
    {
      title: 'Keyboard Support',
      description: 'ESC to cancel, Enter to confirm',
    },
    {
      title: 'Consistent Styling',
      description: 'Matches your application theme automatically',
    },
    {
      title: 'Promise-Based',
      description: 'Async/await support for modern JavaScript patterns',
    },
    {
      title: 'Accessibility',
      description: 'ARIA compliant with screen reader support',
    },
  ];

  async showBasicConfirmation() {
    await this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm Delete',
      accept: () => {
        console.log('Item deleted');
        // Add your delete logic here
      },
      reject: () => {
        console.log('Delete cancelled');
      },
    });
  }

  async showCustomConfirmation() {
    await this.confirmationService.confirm({
      severity: 'warning',
      message:
        'Please confirm if you would like to unlink the report from the organization.',
      header: 'Are you sure?',
      acceptLabel: 'Unlink',
      rejectLabel: 'Cancel',
      accept: () => {
        const reportId = '12345';
        console.log('Unlink report with id:', reportId);
        // Add your unlink logic here
      },
      reject: () => {
        console.log('Report unlink cancelled');
      },
    });
  }

  async showDiscardChanges() {
    await this.confirmationService.confirm({
      message:
        'You have unsaved changes. Are you sure you want to discard them?',
      header: 'Discard Changes',
      acceptLabel: 'Discard',
      rejectLabel: 'Keep Editing',
      accept: () => {
        console.log('Changes discarded');
        // Add your discard logic here
      },
      reject: () => {
        console.log('Continue editing');
      },
    });
  }

  async showDangerousAction() {
    await this.confirmationService.confirm({
      severity: 'danger',
      message:
        'This action cannot be undone. All data will be permanently deleted.',
      header: 'Permanent Deletion',
      acceptLabel: 'Delete Forever',
      rejectLabel: 'Cancel',
      accept: () => {
        console.log('Permanent deletion confirmed');
        // Add your permanent delete logic here
      },
      reject: () => {
        console.log('Deletion cancelled');
      },
    });
  }
}
