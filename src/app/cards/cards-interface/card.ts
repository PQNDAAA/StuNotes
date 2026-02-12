import {Cardstatus} from "../cards-enum/cardstatus";

export interface Card {
  id?:number;
  name:string;
  description:string;
  tag: string;
  createdAt: Date;
  status: Cardstatus;
  important: boolean;
  deadline: string;
  taskId: number[];
}
