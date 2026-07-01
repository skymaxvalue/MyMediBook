import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-experience",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./experience.component.html",
  styleUrl: "./experience.component.css",
})
export class ExperienceComponent implements OnInit {

  @Input() group!: FormGroup;
  @Input() currentStep!: number;

  @Output() next = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();
  minJoiningDate: string = '';

  ngOnInit(): void {

    this.minJoiningDate = new Date().toISOString().split('T')[0];
  }

  onNext() {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }
    this.next.emit(this.currentStep + 1);
  }

  allowOnlyText(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
