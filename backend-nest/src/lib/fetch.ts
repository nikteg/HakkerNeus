import fetch, { Response } from "node-fetch";

function validateReponse(resp: Response) {
  if (resp.ok) {
    return resp;
  } else {
    console.error(resp);
    throw new Error(resp.statusText);
  }
}

export const fetchJSON = <T>(url: string): Promise<T> =>
  fetch(url)
    .then(validateReponse)
    .then((r) => r.json());

