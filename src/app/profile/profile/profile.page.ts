import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, firstValueFrom} from "rxjs";
import {defaultUser, UserInterface} from "../interface/user-interface";
import {Api} from "../../api/services/api";
import {TranslateService} from "@ngx-translate/core";
import {TagsService} from "../../tags/tags-service/tags-service";
import {CardsService} from "../../cards/cards-service/cards-service";
import {ActionSheetController} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  //Camera
  photoSelected = "";

  //UI
  userSubject = new BehaviorSubject<UserInterface>(defaultUser);
  user$ = this.userSubject.asObservable();

  tags = 0;
  cards = 0;

  isLoading = false;

  elapsed = 0;
  intervalId: ReturnType<typeof setInterval> | null = null;

  activeEditingIndex: number = 0;

  constructor(private apiService: Api, private translateService: TranslateService, private tagsService: TagsService,
              private cardsService: CardsService, private actionSheetController: ActionSheetController) {
  }

  ngOnInit(): void {
  }

  async openPhotoOptions(){
    // On instance notre actionsheet qui va nous permettre de choisir entre les options.
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Prendre une photo',
          icon: 'camera-outline',
          handler: () => this.takePhoto(CameraSource.Camera),
        },
        {
          text: 'Choisir depuis la galerie',
          icon: 'image-outline',
          handler: () => this.takePhoto(CameraSource.Photos),
        },
        {
          text: 'Annuler',
          role: 'cancel',
          icon: 'close-outline',
        },
      ],
    });
    await actionSheet.present();
  }

  async takePhoto(source: CameraSource){
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Base64,
        source,
        width: 512,
        height: 512,
      });

      let blob : Blob;

      if(image.webPath){
        const response = await fetch(image.webPath);
        blob = await response.blob();
      } else if(image.base64String) {
        const dataUrl = `data:image/${image.format};base64,${image.base64String}`;
        const response = await fetch(dataUrl);
        blob = await response.blob();
      } else {
        throw new Error("Unable to download image");
      }
      await this.uploadPhoto(blob);
    } catch (error) {
      // L'utilisateur a annulé, ou permission refusée — on ignore silencieusement l'annulation
      console.error('Photo cancelled or error: ', error);
    }
  }

  private async uploadPhoto(blob: Blob){
    try{
      console.log('blob reçu:', blob);
      console.log('blob size:', blob?.size);
      console.log('blob type:', blob?.type);

      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');

      const result = await firstValueFrom(this.apiService.updatePhoto(formData));

      if(result){
        console.log(result);
      }
    } catch (error) {
      console.error('Photo cancelled or error: ', error);
    }
  }

  async ionViewWillEnter() {
    await this.loadProfileData();
  }

  async loadProfileData() {
    this.intervalId = setInterval(() => {
      this.elapsed += 4;
    }, 4);
    console.log("Loading...");
    this.isLoading = true;
    try {
      await Promise.all([firstValueFrom(this.apiService.getUserById()).then((response: any) => {
        this.refreshUserValues({
          email: response.user.email, username: response.user.username,
          birthDate: response.user.dateofbirthday,
        });
        console.log("API: ",response.user);
      }),
        this.cardsService.getCountCards().then(cards => {
          console.log("Nombre de tâches: ", cards);
          this.cards = cards;
        }),
        this.tagsService.countTags().then(tags => {
          console.log("Nombre de matières: ", tags);
          this.tags = tags;
        }),
      ]);
    } finally {
      if (this.intervalId) {
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
    console.log("UI: ", this.userSubject.value);
    console.log("[RefreshUserValues] finished");
  }

  getCurrentLang() {
    return this.translateService.getCurrentLang();
  }

  handleEditing(value: number) {
    this.activeEditingIndex = value;
  }

}
