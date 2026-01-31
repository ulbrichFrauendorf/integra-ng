import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interface for claims checking service.
 * Consuming applications should implement this interface and provide it
 * using the CLAIMS_CHECKER injection token.
 */
export interface ClaimsChecker {
  /**
   * Checks if the current user has the specified claim.
   * @param claim The claim to check
   * @returns Observable<boolean> indicating if the user has the claim
   */
  hasClaim(claim: string): Observable<boolean>;
}

/**
 * Injection token for providing a claims checking service.
 * Applications using claims-based menu filtering should provide
 * an implementation of ClaimsChecker using this token.
 * 
 * @example
 * // In your app.config.ts or module:
 * providers: [
 *   {
 *     provide: CLAIMS_CHECKER,
 *     useExisting: ClaimsClient // Your claims service
 *   }
 * ]
 */
export const CLAIMS_CHECKER = new InjectionToken<ClaimsChecker>('ClaimsChecker');
