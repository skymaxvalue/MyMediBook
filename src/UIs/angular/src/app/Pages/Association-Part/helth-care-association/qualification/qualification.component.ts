import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-qualification",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./qualification.component.html",
  styleUrl: "./qualification.component.css",
})
export class QualificationComponent {
  @Input() group!: FormGroup;
  @Input() currentStep!: number;

  @Output() next = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isFileUploaded = false
  onPrevious() {
    this.back.emit();
  }



  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {

    if (!this.selectedFile) {
      return;
    }

    this.previewUrl = URL.createObjectURL(this.selectedFile);
    this.isFileUploaded = true
    this.group.get('qualificationDocuments')?.setValue(this.previewUrl);

  }


  onNext() {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }
    this.next.emit(this.currentStep + 1);
  }
}
