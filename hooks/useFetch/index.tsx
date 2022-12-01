export enum MethodRequest {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
var host = 'http://127.0.0.1:3000';
const useFetch = () => {
  const HandleResolveRequest = async (requestResponse: Response) =>
    await requestResponse.json();
  const HandleFetch = async (url: string, MethodRequest: MethodRequest) =>
    await fetch(url, {method: MethodRequest});

  const CallServer = (
    url: string,
    MethodRequest: MethodRequest,
    callback: (error: unknown, response: unknown | null) => void,
  ) => {
    HandleFetch(`${host}/${url}`, MethodRequest)
      .then(response => {
        HandleResolveRequest(response)
          .then(reponse => callback(null, reponse))
          .catch(error => callback(error, null));
      })
      .catch(error => callback(error, null));
  };

  return {
    CallServer,
  };
};

export default useFetch;
