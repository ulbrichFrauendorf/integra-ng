import {
  Injectable,
  ComponentRef,
  ViewContainerRef,
  Injector,
  Type,
  createComponent,
  EnvironmentInjector,
  inject,
  ApplicationRef,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IDialog } from '../dialog.component';
import { IDynamicDialogConfig, IDynamicDialogRef } from './dialog.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private environmentInjector = inject(EnvironmentInjector);
  private appRef = inject(ApplicationRef);

  open<T>(
    component: Type<T>,
    config: IDynamicDialogConfig = {}
  ): IDynamicDialogRef {
    // Create the dialog wrapper component
    const dialogRef = createComponent(IDialog, {
      environmentInjector: this.environmentInjector,
    });

    // Create the dynamic component to be displayed inside the dialog
    const componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
    });

    // Set dialog properties
    dialogRef.instance.header = config.header;
    dialogRef.instance.width = config.width || '300px';
    dialogRef.instance.height = config.height;
    dialogRef.instance.contentStyle = config.contentStyle;
    dialogRef.instance.breakpoints = config.breakpoints;
    dialogRef.instance.closable = config.closable !== false;
    dialogRef.instance.modal = config.modal !== false;

    // Create the dialog reference first so we can pass it to the component
    const closeSubject = new Subject<any>();
    let isClosing = false; // Flag to prevent circular calls

    const ref: IDynamicDialogRef = {
      close: (result?: any) => {
        if (isClosing) return; // Prevent circular calls
        isClosing = true;

        dialogRef.instance.hide();

        // Properly detach views from Angular's change detection before destroying
        this.appRef.detachView(componentRef.hostView);
        this.appRef.detachView(dialogRef.hostView);

        if (dialogRef.location.nativeElement.parentNode) {
          dialogRef.location.nativeElement.parentNode.removeChild(
            dialogRef.location.nativeElement
          );
        }
        componentRef.destroy();
        dialogRef.destroy();
        closeSubject.next(result);
        closeSubject.complete();
      },
      onClose: closeSubject.asObservable(),
      instance: dialogRef.instance,
    };

    // Inject data and dialog reference into the dynamic component
    if (componentRef.instance && typeof componentRef.instance === 'object') {
      // Always set config if the property exists
      if ('config' in componentRef.instance) {
        (componentRef.instance as any).config = config;
      }
      // Always set dialogRef if the property exists
      if ('dialogRef' in componentRef.instance) {
        (componentRef.instance as any).dialogRef = ref;
      }
      // Set data from config if it exists and the property exists on the component
      if ('data' in componentRef.instance) {
        (componentRef.instance as any).data = config.data || {};
      }
    }

    // Attach both components to Angular's change detection cycle
    // This is critical for proper change detection in dynamic components
    this.appRef.attachView(dialogRef.hostView);
    this.appRef.attachView(componentRef.hostView);

    // Trigger change detection to ensure ngOnInit is called with the injected data
    componentRef.changeDetectorRef.detectChanges();

    document.body.appendChild(dialogRef.location.nativeElement);

    // Subscribe to dialog visibility changes to handle close button, ESC key, and overlay clicks
    dialogRef.instance.visibleChange.subscribe((visible: boolean) => {
      if (!visible && !isClosing) {
        // Dialog was closed via close button, ESC, or overlay click
        ref.close();
      }
    });

    // Show the dialog and wait for the next tick to ensure DOM is rendered
    dialogRef.instance.show();

    // Insert the dynamic component into the dialog content
    const dialogContent =
      dialogRef.location.nativeElement.querySelector('.i-dialog-content');
    if (dialogContent) {
      dialogContent.appendChild(componentRef.location.nativeElement);
    }

    return ref;
  }
}
