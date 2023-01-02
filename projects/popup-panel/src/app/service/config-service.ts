import { Service } from '../define';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export type Config = { [key: string]: any };

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private zone: NgZone) {}

  save$(config: Config): Observable<void> {
    return new Observable<void>((subscriber) => {
      chrome.storage.local.set(config, () => {
        this.zone.run(() => {
          subscriber.next();
          subscriber.complete();
        });
      });
    });
  }

  load$(keys: string[]): Observable<Config> {
    return new Observable<Config>((subscriber) => {
      chrome.storage.local.get(keys, (items) => {
        this.zone.run(() => {
          subscriber.next(items as Config);
          subscriber.complete();
        });
      });
    });
  }

  loadAllConfig$(): Observable<Config> {
    return this.load$(Object.keys(Service));
  }
}
