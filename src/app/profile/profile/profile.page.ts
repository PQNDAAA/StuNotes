import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, firstValueFrom} from "rxjs";
import {defaultUser, UserInterface} from "../interface/user-interface";
import {Api} from "../../api/services/api";
import {TranslateService} from "@ngx-translate/core";
import {TagsService} from "../../tags/tags-service/tags-service";
import {CardsService} from "../../cards/cards-service/cards-service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  //UI
  userSubject = new BehaviorSubject<UserInterface>(defaultUser);
  user$ = this.userSubject.asObservable();

  tags = 0;
  cards = 0;

  isLoading = false;

  elapsed = 0;
  intervalId : ReturnType<typeof setInterval> | null = null;

  activeEditingIndex: number = 0;

  constructor(private apiService: Api, private translateService: TranslateService, private tagsService: TagsService,
              private cardsService: CardsService) {}

  ngOnInit(): void {}

  async ionViewWillEnter() {
    await this.loadProfileData();
  }

  async loadProfileData(){
    this.intervalId = setInterval(() => {
      this.elapsed+=4;
    }, 4);
    console.log("Loading...");
    this.isLoading = true;
    try {
      await Promise.all([firstValueFrom(this.apiService.getUserById()).then((response: any) => {
        this.refreshUserValues({
          email: response.user.email, username: response.user.username,
          birthDate: new Date(response.user.dateofbirthday).toLocaleDateString(this.getCurrentLang())
        });
      }),
        this.cardsService.getCountCards().then(cards =>{
          console.log("Nombre de tâches: ", cards);
          this.cards = cards;
        }),
        this.tagsService.countTags().then(tags => {
          console.log("Nombre de matières: ", tags);
          this.tags = tags;
        })
      ]);
    } finally {
      if(this.intervalId){
        clearInterval(this.intervalId);
        this.intervalId = null;

        console.log("Le page de profil a chargé en " + this.elapsed + "ms");
        this.elapsed = 0;
      }
      console.log("Loading done");
      this.isLoading = false;
    }
  }

  refreshUserValues(value: UserInterface) {
    this.userSubject.next(value);
    console.log("[RefreshUserValues] finished");
  }

  getCurrentLang() {
    return this.translateService.getCurrentLang();
  }

  handleEditing(value: number) {
    this.activeEditingIndex = value;
  }

}
