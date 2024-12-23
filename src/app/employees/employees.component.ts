import {Component, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {EmployeeService} from './employeeService';
import {Employee} from './employee.model';
import {EmployeeCardComponent} from './employee-card/employee-card.component';
import {EmployeeProfileComponent} from './employee-profile/employee-profile.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-employees',
  imports: [EmployeeCardComponent, EmployeeProfileComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private destroyRef = inject(DestroyRef);

  employees = signal<Employee[] | undefined>(undefined);
  selectedEmployee = signal<Employee | null>(null);
  profileOpen = signal(false);
  isFetching = signal(false);
  showAddEmployeeForm = signal(false);
  newEmployeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required]),
  })
  error = signal('');

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isFetching.set(true);
    const employeesSubscription = this.employeeService.loadEmployees()
      .subscribe({
        next: (employees) => {
          this.employees.set(employees);
        },
        complete: () => this.isFetching.set(false),
        error: (err: Error) => {
          console.error(err.message);
          this.error.set(err.message);
        },
      });
    this.destroyRef.onDestroy(() => employeesSubscription.unsubscribe());
  }

  viewProfile(employee: Employee) {
    this.selectedEmployee.set({ ...employee });
    this.profileOpen.set(true);
  }

  closeProfile() {
    this.profileOpen.set(false);
    this.selectedEmployee.set(null);
  }

  saveProfile(updatedEmployee: Employee) {
    this.employeeService.editEmployeeDetails(updatedEmployee.id, updatedEmployee)
      .subscribe({
        next: () => {
          const updatedList = this.employees()
            ?.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp));
          this.employees.set(updatedList);
          this.closeProfile();
        },
        error: (err) => {
          console.error('Failed to save employee:', err);
        },
      });
  }

  deleteEmployee() {
    if (this.selectedEmployee()) {
      this.employeeService.removeEmployee(this.selectedEmployee()!.id).subscribe({
        next: () => {
          const updatedEmployees = this.employees()!.filter(
            (emp) => emp.id !== this.selectedEmployee()!.id
          );
          this.employees.set(updatedEmployees);
          this.closeProfile();
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
        },
      });
    }
  }

  openAddEmployeeForm() {
    this.showAddEmployeeForm.set(true);
  }

  closeAddEmployeeForm() {
    this.showAddEmployeeForm.set(false);
  }

  addEmployee() {
    if (this.newEmployeeForm.valid) {
      const newEmployee: Employee = {
        id: 0,
        name: this.newEmployeeForm.value.name!,
        salary: +this.newEmployeeForm.value.salary!,
        position: this.newEmployeeForm.value.position!,
      };

      this.employeeService.addEmployee(newEmployee).subscribe({
        next: (addedEmployee) => {
          this.employees.set([...this.employees() as Employee[], addedEmployee]);
          this.closeAddEmployeeForm();
        },
        error: (err) => {
          console.error('Failed to add employee:', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}

