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

  @Output() imageBase64Loaded = new EventEmitter<any>()

  imageForm: FormGroup

  constructor() {
    this.imageForm = new FormGroup({
      image: new FormControl('', [Validators.required]),
      imageBase64: new FormControl(null, [Validators.required])
    })
  }

  get f() {
    return this.imageForm.controls;
  }

  onImageChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const reader = new FileReader()
      const [image] = event.target.files;

      reader.readAsDataURL(image);

      reader.onloadend = () => {
        const imageBase64 = reader.result as string;

        this.imageForm.patchValue({
          imageBase64: imageBase64
        });

        this.imageBase64Loaded.emit(imageBase64)
      };
    } else {
      if (this.imageForm.controls['image'].invalid) {
        this.imageForm.patchValue({
          imageBase64: null
        });

        this.imageBase64Loaded.emit(null)
      }
    }
  }
}
