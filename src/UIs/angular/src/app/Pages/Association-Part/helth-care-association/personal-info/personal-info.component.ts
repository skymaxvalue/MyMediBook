import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Store/app.state';
import * as AuthActions from "../../../../Store/Auth/auth.actions";
import { Country } from 'src/app/Models/Patient-Model';
@Component({
  selector: "app-personal-info",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./personal-info.component.html",
  styleUrl: "./personal-info.component.css",
})
export class PersonalInfoComponent implements OnInit {

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImage = false;
  isFileUploaded = false
  @Input() group!: FormGroup;
  @Input() currentStep!: number;
  @Input() countries: Country[] = []
  @Input() states: any[] = [];
  @Input() cities: any[] = [];
  @Output() next = new EventEmitter<any>();
  @Output() onSelectCountry = new EventEmitter<any>();
  @Output() onSelectState = new EventEmitter<any>();
  showLanguageModal = false;
  newLanguage = '';

  languages = [
    'English',
    'Hindi',
    'Bengali',
    'Tamil'
  ];
  selectedLanguages: string[] = [];



  constructor(private store: Store<AppState>) {
    console.log(this.countries, "=======")
  }

  ngOnInit(): void {
    console.log(this.group.value)

  }


  async onCountryChange(event: any) {
    await this.onSelectCountry.emit(event.target.value)
    // const stateControl = this.group.get('stateId');
    // this.group.get('stateId')?.enable();

  }

  async onStateChange(event: any) {
    await this.onSelectState.emit(event.target.value)


  }
  onCheckboxChange(event: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.group.get('permanentAddress')?.setValue(this.group.get('residentialAddress')?.value)
    }
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
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

  openLanguageModal() {
    this.showLanguageModal = true;
  }

  closeLanguageModal() {
    this.showLanguageModal = false;
    this.newLanguage = '';
  }



  addLanguage() {
    const language = this.newLanguage.trim();

    if (language && !this.languages.includes(language)) {
      this.languages.push(language);
    }

    this.closeLanguageModal();
  }

  onLanguageChange(event: Event, language: string) {

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedLanguages.push(language);
    } else {
      this.selectedLanguages =
        this.selectedLanguages.filter(x => x !== language);
    }

    this.group.get('languagesSpoken')
      ?.setValue(this.selectedLanguages);
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  uploadFile(): void {

    if (!this.selectedFile) {
      return;
    }

    this.previewUrl = URL.createObjectURL(this.selectedFile);
    this.group.get('identityFile')?.setValue(this.previewUrl);
    this.isImage = true
    this.isFileUploaded = true

  }

  onNext() {
    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }

    this.next.emit(this.currentStep + 1);
  }
}