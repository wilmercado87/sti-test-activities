import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Activity, ActivityService, Employee } from 'src/app/services/activity.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../activity/delete/delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  activities: MatTableDataSource<Activity>;
  displayedColumns: string[] = [];
  edit: boolean = false;
  create: boolean = false;
  resourcesLoaded: boolean = false;
  activity: Activity;
  employees: Employee[];

  constructor(private activityService: ActivityService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.getDisplayColums();
  }

  ngOnInit(): void {
    this.getEmployess();
    this.getActivtities();
  }

  ngAfterViewInit() {
    if (this.activities)
      this.activities.paginator = this.paginator;
  }

  getDisplayColums() {
    this.displayedColumns = [
      'name',
      'dateEstimated',
      'status',
      'dateLate',
      'employee',
      'edite',
      'delete'
    ];
  }

  getActivtities() {
    this.resourcesLoaded = false;
    this.activityService.getListActivities().pipe(
      delay(1000)
    ).subscribe((data: Activity[]) => {
      this.activities = new MatTableDataSource(data);
      this.resourcesLoaded = true;
    });
  }

  getEmployess() {
    this.activityService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }

  createActivity() {
    this.edit = false;
    this.create = true;
  }

  editActivity(activity: Activity) {
    this.edit = true;
    this.create = false;
    this.activity = activity;
  }

  deleteActivity(activity: Activity) {
    this.edit = false;
    this.create = false;
    this.activity = activity;
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '250px',
      data: this.activity
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activity = result;
        this.activityService.deleteActivity(this.activity).subscribe(()=> {
          this._snackBar.open('La Actividad ha sido eliminada', 'X');
          this.reload();
        });
      }
    });
  }

  reload() {
    this.activities.data = [];
    this.getActivtities();
    this.edit = false;
    this.create = false;
  }

  isSaveActivity(flag: boolean) {
    if (flag)
      this.reload();
  }

  isUpdatectivity(flag: boolean) {
    if (flag)
      this.reload();
  }

}
