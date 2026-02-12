
import { Cardstatus } from "../cards-enum/cardstatus";

export const CardstatusColors: {[key in Cardstatus]: string} = {

  [Cardstatus.InProgress]: '#ff8228',
  [Cardstatus.Late]: 'red',
  [Cardstatus.Open]: '#0a58a3',
  [Cardstatus.Done]: 'green'
};
