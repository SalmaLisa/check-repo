import http from './httpService';
import { apiUrl } from './../config/config.json';
const apiEndpoint = apiUrl + '/areas';


function areaUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getServices() {
  return http.get(apiEndpoint);
}

export function getService(Id) {
  return http.get(areaUrl(Id));
}

export function saveService(area, attachments, onUploadProgress) {
  const formData = new FormData();
  //clone
  const body = { ...area };
  const config = {
    onUploadProgress: (progressEvent) =>
      //onUploadProgress(Math.trunc(progressEvent.loaded / progressEvent.total)),
      onUploadProgress(progressEvent.loaded / progressEvent.total),
  };

  //update
  if (area._id) {
    //delete _id
    delete body._id;
    delete body.attachments;
    for (let key in body) {
      formData.append(key, body[key]);
    }

    // for uploading files
    if (attachments != null || undefined && attachments.length > 0) {
      for (let x = 0; x <= attachments.length; x++) {
        formData.append('attachments', attachments[x])
      }
    }

    return http.put(areaUrl(area._id), formData, config);
  }
  for (let key in body) {
    formData.append(key, body[key]);
  }
  if (attachments.length > 0) {
    for (let x = 0; x <= attachments.length; x++) {
      formData.append('attachments', attachments[x])
    }
  } else {
    formData.append('attachments', attachments);
  }

  //add a new area
  return http.post(apiEndpoint, formData, config);
}

//delete areas
export function deleteService(Id) {
  return http.delete(areaUrl(Id));
}  