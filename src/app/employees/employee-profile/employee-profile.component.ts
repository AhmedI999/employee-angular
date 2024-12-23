import {Component, input, OnChanges, output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Employee} from '../employee.model';

@Component({
  selector: 'app-employee-profile',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css'
})
export class EmployeeProfileComponent implements OnChanges {
  employee = input.required<Employee | null>();
  isOpen = input.required<boolean>();
  closeProfile = output<void>();
  saveProfile = output<Employee>();
  deleteEmployee = output<void>();

  profileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    salary: new FormControl(0,[
      Validators.required, Validators.min(1)
    ]),
  });

  ngOnChanges() {
    if (this.employee()) {
      this.profileForm.patchValue(this.employee() as Employee);
    }
  }

  onClose() {
    this.closeProfile.emit();
  }

  onSave() {
    if (this.profileForm.valid) {
      const updatedEmployee = { ...this.employee(), ...this.profileForm.value };
      this.saveProfile.emit(updatedEmployee as Employee);
    }
  }

  onDelete() {
    this.deleteEmployee.emit();
  }
}
