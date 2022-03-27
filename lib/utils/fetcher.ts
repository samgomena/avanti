const fetcher = (info: RequestInfo, init: RequestInit) =>
  fetch(info, init).then((res) => res.json());

export default fetcher;
