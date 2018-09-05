import fetch, { Response } from "node-fetch";

function validateReponse(resp: Response) {
  if (resp.ok) {
    return resp;
  } else {
    console.error(resp);
    throw new Error(resp.statusText);
  }
}

export const fetchJSON = (url: string) =>
  fetch(url)
    .then(validateReponse)
    .then((r) => r.json());

