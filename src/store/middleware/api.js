/** @format */
import axios from "axios";
import * as actions from "../api";
const api =
  ({ dispatch }) =>
  next =>
  async action => {
    console.log(action)
    if (action.type !== actions.apiCallBegan.type)return next(action);
    const { url, method, data, onStart, onSuccess, onError } = action.payload;
    if (onStart) dispatch({ type: onStart });
    next(action);
    try {
      const response = await  axios.request({
        baseURL: "http://192.168.1.85:9000/api",
        url,
        method,
        data,
      });
      dispatch(actions.apiCallScuccess.type);
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      console.error(error)
      dispatch(actions.apiCallFailed(error.message));
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };
export default api;
