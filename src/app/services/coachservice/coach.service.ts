import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private apiUrl = 'http://localhost:9090/coaches';

  constructor(private http: HttpClient) {}

  getCoaches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCoach(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCoach(coach: any): Observable<any> {
    return this.http.post(this.apiUrl, coach).pipe(
      catchError(this.handleError)
    );
  }

  updateCoach(id: number, coach: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, coach).pipe(
      catchError(this.handleError)
    );
  }

  deleteCoach(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>('http://localhost:9090/upload/image', formData).pipe(
      tap((response) => console.log('Image upload response:', response)),
      catchError(this.handleError)
    );
  }

  createProgram(coachId: number, program: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${coachId}/programs`, program).pipe(
      tap((response) => console.log('Create program response:', response)),
      catchError(this.handleError)
    );
  }

  updateProgram(coachId: number, programId: number, program: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${coachId}/programs/${programId}`, program).pipe(
      tap((response) => console.log('Update program response:', response)),
      catchError(this.handleError)
    );
  }

  getProgramsByCoach(coachId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${coachId}/programs`).pipe(
      tap((response) => console.log('Programs fetched for coach:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error:', error);
    const errorMessage = error.error instanceof Object ? error.error.message : error.error || error.message || 'Unknown error';
    return throwError(() => new Error(errorMessage));
  }
}