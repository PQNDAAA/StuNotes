export interface UserInterface {
  email: string;
  username: string;
  birthDate: string;
  photo_url: string | null;
}

export const defaultUser : UserInterface = {
  email:"",
  username:"",
  birthDate:"",
  photo_url:"",
}
