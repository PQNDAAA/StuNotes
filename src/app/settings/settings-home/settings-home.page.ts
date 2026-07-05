import {Component, OnInit} from '@angular/core';
import {Settings} from "../settings-service/settings";
import {ISettingsHome} from "../settings-interface/isettings-home";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {LocalNotificationService} from "../../notifications/service/local-notification-service";
import {CardsService} from "../../cards/cards-service/cards-service";
import {Auth} from "../../auth/auth";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.page.html',
  styleUrls: ['./settings-home.page.scss'],
  standalone: false,
})
export class SettingsHomePage implements OnInit {

  settings!: ISettingsHome;
  settings$: Observable<ISettingsHome>;

  isCondensate = false;

  constructor(private settingsService: Settings, private translate: TranslateService,
              private localNotification: LocalNotificationService, private cards: CardsService,
              private authService: Auth) {
    this.settings$ = this.settingsService.settingsHome$;
  }

  ngOnInit() {
    this.settings$.subscribe(data => {
      this.settings = data
    });
  }

  async onLanguageChange(event: any) {
    const detail = event.detail.value.trim();
    const languageUpdated = {...this.settings, currentLanguage: detail};

    this.translate.use(detail);
    await this.settingsService.changeSettingsValue(languageUpdated);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    console.log("Scroll position ", scrollTop);

    if (scrollTop > 60) {
      console.log("Atteint");
      this.isCondensate = true;
    } else {
      this.isCondensate = false;
      console.log("<60");
    }
  }

  async onToggle(settingsKey: string, event: any) {
    const value = event.detail.checked;
    const settingsUpdated = {...this.settings, [settingsKey]: value};

    try {
      await this.settingsService.changeSettingsValue(settingsUpdated);
    } catch (err) {
      console.error("Settings update failed", err);
      return;
    }

    switch (settingsKey) {
      case 'darkMode':
        document.body.classList.toggle('dark', value);
        break;
      case 'taskReminders':
        if (!value) {
          return await this.clearAllScheduledTasks();
        } else {
          await this.cards.reBuildRemindersForCards();
        }
        break;
      case 'urgentDeadlineAlerts':
        break;
    }
  }

  async segmentChanged(event: any) {
    const value = event.target.value;
    const modeUpdated = {...this.settings, darkMode: value };

    document.body.classList.toggle('dark', value === 'dark-mode');

    await this.settingsService.changeSettingsValue(modeUpdated);
  }

  async logOut() {
    await this.authService.removeToken();
  }

  async clearAllScheduledTasks() {
    await this.localNotification.clearAllScheduledTasks();
  }

  get getCurrentLanguage(): string {
    return this.translate.getCurrentLang();
  }

  get getAllLanguages() {
    return this.translate.getLangs();
  }
}
