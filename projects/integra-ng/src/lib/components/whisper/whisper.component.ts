import { NgClass, NgIf, NgFor, NgStyle } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WhisperService } from './services/whisper.service';
import {
  IWhisperMessage,
  IWhisperOptions,
} from './services/whisper.interfaces';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ZIndexUtils } from '../../utils/zindexutils';
import { IButton } from '../button/button.component';
import { ISeverity } from '@shared/enums/IButtonSeverity';

@Component({
  selector: 'i-whisper',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, NgStyle, IButton],
  templateUrl: './whisper.component.html',
  styleUrl: './whisper.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class IWhisper implements OnInit, OnDestroy {
  @Input() key?: string;
  @Input() autoZIndex = true;
  @Input() baseZIndex = 0;
  @Input() style?: { [key: string]: any };
  @Input() position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right' = 'top-right';
  @Input() preventOpenDuplicates = false;
  @Input() preventDuplicates = false;

  messages: IWhisperMessage[] = [];
  messageSubscription?: Subscription;
  clearSubscription?: Subscription;

  componentId = UniqueComponentId('i-whisper-');

  constructor(
    private whisperService: WhisperService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.messageSubscription = this.whisperService.messageObserver.subscribe(
      (message) => {
        if (message) {
          // Key filtering logic:
          // - If component has a key, only show messages with the exact same key
          // - If component has no key, only show messages with no key
          if (this.key) {
            // Component has a key - only show messages with matching key
            if (message.key !== this.key) {
              return;
            }
          } else {
            // Component has no key - only show messages with no key
            if (message.key) {
              return;
            }
          }

          if (this.preventDuplicates) {
            const isDuplicate = this.messages.some(
              (m) =>
                m.summary === message.summary &&
                m.detail === message.detail &&
                m.severity === message.severity
            );
            if (isDuplicate) return;
          }

          if (this.preventOpenDuplicates) {
            this.messages = this.messages.filter(
              (m) =>
                !(
                  m.summary === message.summary &&
                  m.detail === message.detail &&
                  m.severity === message.severity
                )
            );
          }

          this.messages = [...this.messages, message];

          if (message.life && message.life > 0) {
            setTimeout(() => {
              this.remove(message);
            }, message.life);
          }

          this.cd.markForCheck();
        }
      }
    );

    this.clearSubscription = this.whisperService.clearObserver.subscribe(
      (key) => {
        if (key) {
          this.messages = this.messages.filter((m) => m.key !== key);
        } else {
          this.messages = [];
        }
        this.cd.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    if (this.clearSubscription) {
      this.clearSubscription.unsubscribe();
    }
  }

  remove(message: IWhisperMessage): void {
    this.messages = this.messages.filter((m) => m.id !== message.id);
    this.cd.markForCheck();
  }

  removeAll(): void {
    this.messages = [];
    this.cd.markForCheck();
  }

  onClose(message: IWhisperMessage): void {
    this.remove(message);
  }

  getMessageIcon(severity: ISeverity): string {
    switch (severity) {
      case 'success':
        return 'pi-check-circle';
      case 'info':
        return 'pi-info-circle';
      case 'warning':
        return 'pi-exclamation-triangle';
      case 'danger':
        return 'pi-times-circle';
      default:
        return 'pi-info-circle';
    }
  }

  getContainerClass(): string {
    return `i-whisper i-whisper-${this.position}`;
  }

  getMessageClass(message: IWhisperMessage): string {
    let classes = 'i-whisper-message';
    if (message.severity) {
      classes += ` i-whisper-message-${message.severity}`;
    }
    return classes;
  }

  trackByMessage(index: number, message: IWhisperMessage): any {
    return message.id;
  }
}
