import {FilterDateEnum} from "../enum/filter-date-enum";

export interface FilterInterface {
  important: boolean,
  tags: Map<string, boolean>,
  date: FilterDateEnum | null,
  customDate: {start: Date | null, end: Date | null} | null,
}

export const defaultFilterInterface: FilterInterface = {
  important: false,
  tags: new Map<string, boolean>(),
  date: null,
  customDate: null,
}
