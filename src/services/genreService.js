import http from "./httpService";
//import { apiUrl } from "../config.json";

const apiEndpoint = "/genres";

export function getGenres() {
  return http.get(apiEndpoint);
}
