import {Cardstatus} from "../cardstatus";

export interface Card {
  id?:number;
  name:string;
  description:string;
  tag: string;
  createdAt: Date;
  status: Cardstatus;
}
