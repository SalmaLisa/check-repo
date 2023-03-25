import http from './httpService';
import { apiUrl } from './../config/config.json';
const apiEndpoint = apiUrl + '/areas';

function areaUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAreas() {
  return http.get(apiEndpoint);
}

export function getArea(Id) {
  return http.get(areaUrl(Id));
}

export function saveArea(area) {
  const formData = new FormData();
  //clone
  const coordinates = [39.210975, 60.722113];
  const body = { ...area };

  //update

  if (area._id) {
    const body = { ...area };
    delete body._id;
    delete body.location;
    // body.push(coordinates);
    let obj = Object.assign(body, { coordinates });
    for (let key in body) {
      formData.append(key, body[key]);
    }
    console.log(obj, 'body is');
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return http.put(areaUrl(area._id), obj);
  }

  for (let key in body) {
    formData.append(key, body[key]);
  }

  //add a new area

  return http.post(apiEndpoint, body);
}

//delete areas
export function deleteService(Id) {
  return http.delete(areaUrl(Id));
}
