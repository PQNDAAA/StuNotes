import {Component, OnInit} from '@angular/core';
import {SplashScreen} from "@capacitor/splash-screen";
import {Haptics} from "@capacitor/haptics";
import {Settings} from "./settings";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit{
  constructor(private settingsService: Settings) {
    this.showSplash();
  }

  ngOnInit(){
    this.settingsService.settingsHome$.subscribe(data => {
      document.body.classList.toggle('dark',data.darkMode);
    });
    }

  async showSplash(){
    await SplashScreen.show({
      showDuration: 3500,
      autoHide: true,
    });
  }



}
