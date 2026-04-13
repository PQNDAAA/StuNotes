import {Cardstatus} from "../cards-enum/cardstatus";
import {Reminder} from "../../notifications/interface/reminder";

export interface Card {
  id?:number;
  name:string;
  description:string;
  tag: string;
  createdAt: Date;
  status: Cardstatus;
  important: boolean;
  deadline: string;
  reminder: Reminder;
}
