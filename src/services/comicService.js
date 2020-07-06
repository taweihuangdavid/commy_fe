import http from "./httpService";
//import { apiUrl } from "../config.json";

const apiEndpoint = "/comics";

function comicUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getComics() {
  return http.get(apiEndpoint);
}

export function getComic(comicId) {
  return http.get(comicUrl(comicId));
}

export function saveComic(comic) {
  if (comic._id) {
    const body = { ...comic };
    delete body._id;
    return http.put(comicUrl(comic._id), body);
  }

  return http.post(apiEndpoint, comic);
}

export function deleteComic(comicId) {
  return http.delete(comicUrl(comicId));
}
