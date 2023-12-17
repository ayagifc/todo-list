import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
  };

  const instance = axios.create(defaultOptions);
  return instance;
};

export default ApiClient();
