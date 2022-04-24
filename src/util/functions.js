import moment from "moment";
import {DATE_STRING_FORMAT} from "./constants";

const dateStringToAlias = (dateString) => {
  const date = !!dateString ? moment(dateString, DATE_STRING_FORMAT) : null;
  return !!date ? date.format('MM/DD') : 'NA';
}

export {dateStringToAlias};
