import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'relfinder' },
  { path: 'relfinder', component: AppComponent },
  { path: '**', redirectTo: 'relfinder' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
