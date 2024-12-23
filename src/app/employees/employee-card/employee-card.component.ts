import {Component, EventEmitter, input, output, Output} from '@angular/core';
import {Employee} from '../employee.model';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-employee-card',
  imports: [
    DecimalPipe
  ],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  employee = input.required<Employee>();
  viewProfile= output<void>();

  onViewProfile() {
    this.viewProfile.emit();
    console.log(`Viewing profile for ${this.employee().name}`);
  }
}
