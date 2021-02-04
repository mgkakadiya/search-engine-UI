import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [{
  path: 'search-result-list',
  component: SearchResultComponent,

  children: [
    {
      path: ':search', component: SearchResultComponent
    }
  ]
},
{
  path: '',
  component: SearchResultComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
