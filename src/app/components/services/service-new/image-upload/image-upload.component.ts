import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {

  @Output() imageLoaded = new EventEmitter<any>()

  imageSrc: string = '';

  imageForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor() { }

  get f() {
    return this.imageForm.controls;
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;

        this.imageForm.patchValue({
          fileSource: reader.result as string
        });

        this.imageLoaded.emit(this.imageForm.value)
      };
    }
  }
}
