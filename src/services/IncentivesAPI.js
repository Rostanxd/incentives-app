import axios from 'axios';
import Config from '../config';

const IncentivesAPI = {
  getIncentives: (year, month) => {
    //return axios.get(`./tests/dummy_data_new_${year}_${month}.json`);
    const body = {
      "anio": year,
      "mes": month
    }
    return axios.post(`${Config.baseURL}/WsNomLibretaMetasGET`, body);
  },
  postIncentives: (year, month, payload) => {
    return axios.post(`${Config.baseURL}/WsNomLibretaMetasPOST`, payload);
  },
}

export default IncentivesAPI;
