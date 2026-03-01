import {FilterDateEnum} from "../enum/filter-date-enum";

export const FilterDateConst: {[key in FilterDateEnum]: number} = {
  [FilterDateEnum.Today]: Date.now(),
  [FilterDateEnum.Soon]: 0,
  [FilterDateEnum.Week]: 0,
  [FilterDateEnum.Month]: 0
}
