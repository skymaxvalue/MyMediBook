import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: "app-employment-details",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./employment-details.component.html",
  styleUrl: "./employment-details.component.css",
})
export class EmploymentDetailsComponent {

  @Input() group!: FormGroup;
  @Input() currentStep!: number;
  @Output() back = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  submit(): void {

    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }

    this.submitForm.emit();

  }
}
