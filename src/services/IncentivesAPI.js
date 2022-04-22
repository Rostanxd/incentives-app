import axios from 'axios';


const IncentivesAPI = {
  getIncentives: (year, month) => {
    return axios.get(`https://watch-world.s3.us-east-2.amazonaws.com/apps/incentives-app/tests/dummy_data_${year}_${month}.json`);
  },
  postIncentives: (year, month, payload) => {
    return axios.post(`./incentives`, payload);
  },
}

export default IncentivesAPI;
