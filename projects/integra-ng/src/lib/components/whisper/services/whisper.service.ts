import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IWhisperMessage, IWhisperOptions } from './whisper.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WhisperService {
  private messageSource = new Subject<IWhisperMessage>();
  private clearSource = new Subject<string | null>();
  
  messageObserver = this.messageSource.asObservable();
  clearObserver = this.clearSource.asObservable();

  private defaultOptions: IWhisperOptions = {
    position: 'top-right',
    preventOpenDuplicates: false,
    preventDuplicates: false,
  };

  private options: IWhisperOptions = { ...this.defaultOptions };

  /**
   * Adds a new message to the whisper container
   * @param message The message to display
   */
  add(message: IWhisperMessage): void {
    if (message) {
      // Generate a unique ID if not provided
      if (!message.id) {
        message.id = this.generateId();
      }

      // Set default values
      message.life = message.life ?? 3000;
      message.closable = message.closable ?? true;
      message.severity = message.severity ?? 'info';

      this.messageSource.next(message);
    }
  }

  /**
   * Adds multiple messages to the whisper container
   * @param messages Array of messages to display
   */
  addAll(messages: IWhisperMessage[]): void {
    if (messages && messages.length) {
      messages.forEach(message => this.add(message));
    }
  }

  /**
   * Clears all messages or messages with a specific key
   * @param key Optional key to clear specific messages
   */
  clear(key?: string): void {
    this.clearSource.next(key || null);
  }

  /**
   * Sets configuration options for the whisper service
   * @param options Configuration options
   */
  setOptions(options: IWhisperOptions): void {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * Gets current configuration options
   * @returns Current options
   */
  getOptions(): IWhisperOptions {
    return { ...this.options };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}