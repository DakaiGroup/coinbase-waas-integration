import type { IAPIRejection, IAPIRequest } from '../typings';
import { API_BASE } from '@env';

export const api = async <T, Body>({ method, path, body, token }: IAPIRequest<Body>): Promise<T & IAPIRejection> => {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const requestInitParams: RequestInit = { method, headers, body: body ? JSON.stringify(body) : undefined };

  return fetch(`${API_BASE}/${path}`, requestInitParams)
    .then(
      response =>
        new Promise<T & IAPIRejection>(async (resolve, reject) => {
          console.log(response.status, `${API_BASE}/${path}`, body ? JSON.stringify(body) : undefined);

          if (response.status < 400 && response.ok) {
            try {
              const parsed = await response.json();
              resolve({ ...parsed, code: response.status });
            } catch (error) {
              resolve({ code: response.status, message: '' } as T & IAPIRejection);
            }
          } else {
            try {
              const parsed = JSON.parse(await response.text());
              reject({
                message: getErrorMessage(response.status, parsed?.message),
                code: response.status,
                extra: parsed?.extra,
              });
            } catch (error) {
              reject({ message: 'Something went wrong, please try again later!', code: response.status });
            }
          }
        }),
    )
    .catch(err => {
      return new Promise<T & IAPIRejection>((_, reject) => {
        if (err.name !== 'AbortError') {
          reject(err);
        }
      });
    });
};

const getErrorMessage = (statusCode: number, message?: string) => {
  switch (statusCode) {
    case 401:
      return message || 'Something went wrong, please try again later!';

    case 403:
      return message || 'Something went wrong, you do not have permission to perform this action!';

    default:
      return message || 'Something went wrong, please try again later!';
  }
};
