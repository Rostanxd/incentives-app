import axios from 'axios';
import Config from '../config';

const IncentivesAPI = {
  getIncentives: (year, month) => {
    const body = {
      "anio": year,
      "mes": month
    }
    return axios.post(`${Config.baseURL}/WsNomLibretaMetasGET`, body,
      {headers: {"Content-Type": "application/json"}});
  },
  postIncentives: (year, month, payload) => {
    return axios.post(`${Config.baseURL}/WsNomLibretaMetasPOST`, payload,
      {headers: {"Content-Type": "application/json"}});
  },
}

export default IncentivesAPI;
