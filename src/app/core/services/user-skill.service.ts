import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemSkill, UserSkill, LearningGoal, AddUserSkillRequest, AddLearningGoalRequest } from '../models/user-skill.model';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserSkillService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  constructor(private http: HttpClient) {}

  getSystemSkills(): Observable<SystemSkill[]> {
    return this.http.get<{ data: SystemSkill[] }>(`${this.apiUrl}/skills`).pipe(
      map(response => response.data.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getTeachSkills(): Observable<UserSkill[]> {
    return this.http.get<ApiResponse<UserSkill[]>>(`${this.apiUrl}/user/skills`).pipe(
      map(res => res.data)
    );
  }

  getLearningGoals(): Observable<LearningGoal[]> {
    return this.http.get<ApiResponse<LearningGoal[]>>(`${this.apiUrl}/user/learning-goals`).pipe(
      map(res => res.data)
    );
  }

  addTeachSkill(data: AddUserSkillRequest): Observable<ApiResponse<UserSkill>> {
    return this.http.post<ApiResponse<UserSkill>>(`${this.apiUrl}/user/skills/teach`, data);
  }

  addLearningGoal(data: AddLearningGoalRequest): Observable<ApiResponse<LearningGoal>> {
    return this.http.post<ApiResponse<LearningGoal>>(`${this.apiUrl}/user/skills/learn`, data);
  }

  deleteTeachSkill(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/user/skills/teach/${id}`);
  }

  deleteLearningGoal(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/user/skills/learn/${id}`);
  }

  generateRoadmap(goalId: number): Observable<ApiResponse<LearningGoal>> {
    return this.http.post<ApiResponse<LearningGoal>>(`${environment.apiUrl}/${environment.apiVersion}/learning-goals/${goalId}/roadplan/generate`, {});
  }

  updateRoadmapProgress(goalId: number, roadmap: any): Observable<ApiResponse<LearningGoal>> {
    return this.http.patch<ApiResponse<LearningGoal>>(`${environment.apiUrl}/${environment.apiVersion}/learning-goals/${goalId}/roadplan`, roadmap);
  }
}
