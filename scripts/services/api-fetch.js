import { baseUri, tokenKey } from "../config.js";

async function getResponse(endPoint, {method, headers, body}={}) {
  let token = sessionStorage.getItem(tokenKey);
  
  if(token){
    headers= {
      "Authorization": `Token token=${token}`,
      ...headers
    }
  }
  if(body){
    headers= {
      "Content-Type": "application/json",
      ...headers
    }
  }

  const config = {
    method: method || (body ? "POST": "GET"),
    headers: headers,
    body: body ? JSON.stringify(body) : null
  }

  const response = await fetch(baseUri+endPoint, config);

  let data;
  
  try {
    data = await response.json();
  } catch (error) {
    if (!response.statusText == "No Content") throw new Error(response.statusText);
    console.log("Error at getting response.json") // error al resolver la promesa que devuelve .json
  }

  if (!response.ok) {
    throw new Error(JSON.stringify(data.errors.message || data));
  }

  return data;
}

export default getResponse;
