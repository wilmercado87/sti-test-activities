import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityService, Employee } from 'src/app/services/activity.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnChanges {
  saveForm: FormGroup;
  @Input() employees: Employee[];
  @Output() isSaveActivity = new EventEmitter<boolean>();
  currentDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildForm();
  }

  buildForm() {
    this.currentDate = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    this.saveForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      dateEstimated: new FormControl('', Validators.required),
      asigned: new FormControl(null, Validators.required),
    });
    this.saveForm.reset();
  }

  saveActivity() {
    let activity = {
      name: this.saveForm.get('name')?.value,
      dateEstimated: this.saveForm.get('dateEstimated')?.value,
      dateLate: 0,
      status: "PENDIENTE",
      employee: this.saveForm.get('asigned')?.value
    }
    this.activityService.createActivity(activity).subscribe(
      (data)=> {
      this.isSaveActivity.emit(true);
      this.saveForm.reset();
      this._snackBar.open('La Actividad fue creada exitosamente', 'X');
    }, error => {
      if (error && error.status === 500 && error.error.message.includes('activity.name_UNIQUE]')){
        this._snackBar.open('Ya existe una actividad creada con ese nombre', 'X');
      }
    }
    );
  }
}
