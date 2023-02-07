import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/areas';


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
    //clone
    const body = { ...area };
    console.log("about to save area : " , body);
   //update
   if (area._id) {
     delete body._id;
     return http.put(areaUrl(area._id),body);
   }
 
   //add a new area
   return http.post(apiEndpoint, area);
 }
  
  //delete areas
  export function deleteArea(Id) {
    return http.delete(areaUrl(Id));
  }  