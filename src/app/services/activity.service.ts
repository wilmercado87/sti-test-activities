import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  URL_API = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getListActivities() : Observable<Activity[]>{
    return this.http.get<Activity[]>(`${this.URL_API}/activities`);
  }

  getEmployees() : Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.URL_API}/employees`);
  }

  createActivity(activity: Activity) : Observable<Activity> {
    return this.http.post<Activity>(`${this.URL_API}/activity/save`, activity);
  }

  editActivity(activity: Activity) {
    return this.http.put<Activity>(`${this.URL_API}/activity/update`, activity);
  }

  deleteActivity(activity: Activity) {
    return this.http.put<Activity>(`${this.URL_API}/activity/delete`, activity);
  }
}

export interface Activity {
    id?: number;
    name: string;
    dateEstimated: Date;
    status: string;
    dateLate: number;
    employee: Employee;
}

export interface Employee {
  id: number;
  name: string;
}

