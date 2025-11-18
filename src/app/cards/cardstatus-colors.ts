
import { Cardstatus } from "./cardstatus";

export const CardstatusColors: {[key in Cardstatus]: string} = {

  [Cardstatus.InProgress]: '#ff8228',
  [Cardstatus.Late]: 'red',
  [Cardstatus.ToDo]: '#0a58a3',
  [Cardstatus.Finished]: 'green'
};
