import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-experience",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./experience.component.html",
  styleUrl: "./experience.component.css",
})
export class ExperienceComponent {
  @Input() group!: FormGroup;
  @Input() currentStep!: number;

  @Output() next = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();

  onNext() {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }
    this.next.emit(this.currentStep + 1);
  }
}
