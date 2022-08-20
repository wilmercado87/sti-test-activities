import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './components/activities/activities.component';
import { CreateComponent } from './components/activity/create/create.component';
import { EditComponent } from './components/activity/edit/edit.component';

const routes: Routes = [

  { path: "activities", component: ActivitiesComponent },
  { path: "edit", component: EditComponent },
  { path: "crear", component: CreateComponent },
  { path: "**", pathMatch: "full", redirectTo: "activities" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
