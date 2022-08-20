import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Activity,
  ActivityService,
  Employee,
} from 'src/app/services/activity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges {
  @Input() activity: Activity;
  @Input() employees: Employee[];
  @Output() isUpdatectivity = new EventEmitter<boolean>();
  editForm: FormGroup;
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
    this.currentDate = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US')
    console.log(this.currentDate)
    this.editForm = this.formBuilder.group({
      name: new FormControl(this.activity.name, Validators.required),
      dateEstimated: new FormControl(
        formatDate(this.activity.dateEstimated, 'yyyy-MM-ddTHH:mm', 'en-US'),
        Validators.required
      ),
      dateLate: new FormControl(this.activity.dateLate, Validators.required),
      status: new FormControl(this.activity.status, Validators.required),
      asigned: new FormControl(
        this.activity.employee,
        Validators.required
      ),
    });
  }

  public objectCompare( option: any, value: any ) : boolean {
    return option.id === value.id;
  }

  updateActivity() {
    let activity = {
      id: this.activity.id,
      name: this.editForm.get('name')?.value,
      dateEstimated: this.editForm.get('dateEstimated')?.value,
      dateLate: this.activity.dateLate,
      status: this.editForm.get('status')?.value,
      employee: this.editForm.get('asigned')?.value
    }
    this.activityService.editActivity(activity).subscribe(
      (data)=> {
      this.isUpdatectivity.emit(true);
      this._snackBar.open('La Actividad fue actualizada exitosamente', 'X');
    }, error => {
      if (error && error.status === 500 && error.error.message.includes('activity.name_UNIQUE]')){
        this._snackBar.open('Ya existe una actividad creada con ese nombre', 'X');
      }
    }
    );
  }
}
