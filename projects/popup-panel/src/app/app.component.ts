import { Service } from './define';
import { ConfigService } from './service/config-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'popup-panel';

  meet: string | null;
  photo: string | null;
  mail: string | null;
  drive: string | null;
  youtube: string | null;

  constructor(private configService: ConfigService) {
    this.configService.loadAllConfig$().subscribe((cfg) => {
      this.meet = cfg[Service.Meet] ?? null;
      this.photo = cfg[Service.Photo] ?? null;
      this.mail = cfg[Service.Mail] ?? null;
      this.drive = cfg[Service.Drive] ?? null;
      this.youtube = cfg[Service.Youtube] ?? null;
    });
  }

  onConfigChange(): void {
    this.configService
      .save$({
        [Service.Meet]: empty2null(this.meet),
        [Service.Photo]: empty2null(this.photo),
        [Service.Mail]: empty2null(this.mail),
        [Service.Drive]: empty2null(this.drive),
        [Service.Youtube]: empty2null(this.youtube),
      })
      .subscribe();
  }
}

function empty2null(value: string | null): string | null {
  return value === '' ? null : value;
}
