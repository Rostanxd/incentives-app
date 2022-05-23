import moment from "moment";
import Constants from "./constants";

const dateStringToAlias = (dateString) => {
  const date = !!dateString ? moment(dateString, Constants.DATE_STRING_FORMAT) : null;
  return !!date ? date.format('MM/DD') : 'NA';
}

const numberWithThousandsSeparator = (number) => {
  if (!!number) {
    var numParts = number.toString().split(".");
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numParts.join(".");
  }
  return "0";
}

export default {dateStringToAlias, numberWithThousandsSeparator};
