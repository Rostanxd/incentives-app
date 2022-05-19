import moment from "moment";
import Constants from "./constants";

const dateStringToAlias = (dateString) => {
  const date = !!dateString ? moment(dateString, Constants.DATE_STRING_FORMAT) : null;
  return !!date ? date.format('MM/DD') : 'NA';
}

export default {dateStringToAlias};
