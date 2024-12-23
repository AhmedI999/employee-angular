import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employee} from './employee.model';
import {catchError, tap, throwError} from 'rxjs';
import {API_ENVIRONMENT_PATH, API_EMPLOYEES_PATH} from '../app.apiRoutes';


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private httpClient = inject(HttpClient);
  private employeesSignal = signal<Employee[]>([]);
  private selectedEmployeeSignal = signal<Employee | null>(null);

  get employees() {
    return this.employeesSignal.asReadonly();
  }

  get selectedEmployee() {
    return this.selectedEmployeeSignal.asReadonly();
  }

  loadEmployees() {
    return this.httpClient
      .get<Employee[]>(API_ENVIRONMENT_PATH + API_EMPLOYEES_PATH)
      .pipe(
        tap((employees) => this.employeesSignal.set(employees)),
        catchError((error) => {
          console.error('Failed to fetch employees:', error);
          return throwError(() => new Error('Failed to fetch employees. Please try again later.'));
        })
      );
  }

  loadEmployeeById(id: number) {
    return this.httpClient
      .get<Employee>(API_ENVIRONMENT_PATH + API_EMPLOYEES_PATH + `/${id}`)
      .pipe(
        tap((employee) => this.selectedEmployeeSignal.set(employee)),
        catchError((error) => {
          console.error(`Failed to fetch employee with ID: ${id}`, error);
          return throwError(() => new Error(`Failed to fetch employee with ID: ${id}.`));
        })
      );
  }

  addEmployee(employee: Employee) {
    return this.httpClient
      .post<Employee>(API_ENVIRONMENT_PATH + API_EMPLOYEES_PATH, employee)
      .pipe(
        tap((newEmployee) => {
          const currentEmployees = this.employeesSignal();
          this.employeesSignal.set([...currentEmployees, newEmployee]);
        }),
        catchError((error) => {
          console.error('Failed to add the employee:', error);
          return throwError(() => new Error('Failed to add the employee. Please try again.'));
        })
      );
  }

  editEmployeeDetails(id: number, updatedEmployee: Employee) {
    return this.httpClient
      .put<Employee | null>(API_ENVIRONMENT_PATH + API_EMPLOYEES_PATH + `/${id}`, updatedEmployee)
      .pipe(
        tap(() => {
          const currentEmployees = this.employeesSignal();
          const updatedList = currentEmployees.map((emp) =>
            emp.id === id ? updatedEmployee : emp
          );
          this.employeesSignal.set(updatedList);
        }),
        catchError((error) => {
          console.error('Failed to update employee details:', error);
          return throwError(() => new Error('Failed to update employee details. Please try again.'));
        })
      );
  }

  removeEmployee(id: number) {
    return this.httpClient
      .delete<{ message: string }>(API_ENVIRONMENT_PATH + API_EMPLOYEES_PATH + `/${id}`)
      .pipe(
        tap(() => {
          const currentEmployees = this.employeesSignal();
          const filteredEmployees = currentEmployees.filter((emp) => emp.id !== id);
          this.employeesSignal.set(filteredEmployees);
        }),
        catchError((error) => {
          console.error('Failed to remove the employee:', error);
          return throwError(() => new Error('Failed to remove the employee. Please try again.'));
        })
      );
  }
}
