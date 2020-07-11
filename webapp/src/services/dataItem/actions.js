import axios from "axios";

import { dataItemURL } from "services/urls";

export const fetchDataItem = async (path) => {
  try {
    const response = await axios.get(`${dataItemURL}/${path}`);
    return response.data;
  } catch (error) {
    console.log("Could not fetch item. Try again later.");
    console.log(error);
  }
};
