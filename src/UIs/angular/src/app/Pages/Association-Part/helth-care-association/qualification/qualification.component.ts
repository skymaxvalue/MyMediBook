import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-qualification",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./qualification.component.html",
  styleUrl: "./qualification.component.css",
})
export class QualificationComponent implements OnInit {

  @Input() group!: FormGroup;
  @Input() currentStep!: number;

  @Output() next = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isFileUploaded = false
  maxDate: string = '';
  minExpiryDate: string = '';
  ngOnInit(): void {

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    this.maxDate = nextYear.toISOString().split('T')[0];

    nextYear.setFullYear(nextYear.getFullYear() + 1);

    this.minExpiryDate = new Date().toISOString().split('T')[0];
  }


  onPrevious() {
    this.back.emit();
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

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;

      this.group.get('qualificationDocuments')?.setValue(base64String);

    };

    reader.readAsDataURL(this.selectedFile);


    this.isFileUploaded = true;


  }


  onNext() {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }
    this.next.emit(this.currentStep + 1);
  }
}
