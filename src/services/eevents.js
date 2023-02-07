import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/eevents';


  function eeventUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getEevents() {
    return http.get(apiEndpoint);
  }
  
  export function getEevent(Id) {
    return http.get(eeventUrl(Id));
  }
  
  export function saveEevent(eevent) {
    //clone
    const body = { ...eevent };
    console.log("about to save eevent : " , body);
   //update
   if (eevent._id) {
     delete body._id;
     return http.put(eeventUrl(eevent._id),body);
   }
 
   //add a new eevent
   return http.post(apiEndpoint, eevent);
 }
  
  //delete eevents
  export function deleteEevent(Id) {
    return http.delete(eeventUrl(Id));
  }  