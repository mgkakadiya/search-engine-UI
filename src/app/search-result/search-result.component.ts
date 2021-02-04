import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiClinetService } from "../api-clinet.service";
import * as ApiConstants from '../constants ';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})

export class SearchResultComponent implements OnInit {

  filteredOptions : any;
  suggestionValue: SearchSuggestion;
  searchList: SearchSuggestion[];
  apiClient: ApiClinetService;
  pageNumber : number;
  totalLength: number;
  pageSize: number
  autoCompleteControl = new FormControl();
  options: SearchSuggestion[] = []
  
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    apiClient: ApiClinetService) {
    filteredOptions: new Observable<SearchSuggestion[]>();
    this.totalLength= 0;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.route = route;
    this.suggestionValue = this.getdefaultDropdownItem('');
    this.apiClient = apiClient;
    this.searchList = [];
  }

 ngOnInit() {
   this.filteredOptions = this.autoCompleteControl.valueChanges
     .pipe(
       startWith(''),
       map(value => typeof value === 'string' ? value : value.name),
       map(title => title ? this._filter(title) : this.options.slice())
     );

    this.route.queryParams.subscribe(params => {
      if(params['search']){
        this.options.push(this.getdefaultDropdownItem(params['search']));
        this.suggestionValue = this.getdefaultDropdownItem(params['search']);
        this.getDefaultSearchResult();
      }
   });
 }

 ngAfterViewInit() {
  try{
    this.route.queryParams.subscribe(params => {
      if(this.suggestionValue && this.suggestionValue.title){
        this.autoCompleteControl.setValue({title: this.suggestionValue.title});
      }
   });
   } catch(err){
    console.log('default value set');
   }
 }

 getdefaultDropdownItem(selectedString: string){
  let searcItem: SearchSuggestion = {
    title: selectedString,
    text: selectedString,
    id: 0,
    submissionDate: new Date(),
    url: '',
    tags: selectedString
  };
  return searcItem;
 }

 getDefaultSearchResult(){
  this.getSearchResult(this.pageNumber, this.pageSize);
 }

 displayFn(searchResult: SearchSuggestion): string {
  return searchResult && searchResult.title ? searchResult.title : '';
 }
 
 private _filter(title: string): SearchSuggestion[] {
   const filterValue = title.toLowerCase();
  return this.options.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
 }

 displayResult(selectedOption: any) {
  this.suggestionValue = selectedOption.option.value.title;
  this.router.navigate(['/search-result-list'], { queryParams: { search: selectedOption.option.value.title } });
  this.getDefaultSearchResult();
 }

  async findSearchSuggestionFn(){
    try{
      const keyword = this.suggestionValue.title != undefined ? this.suggestionValue.title : this.suggestionValue;
      this.options = await this.apiClient.get<SearchSuggestion[]>({
        url: ApiConstants.SUGGESTION_URL,
        params: {
          page: 0,
          pageSize: 10, 
          keyword: keyword
        }
      });
    } catch(err){
      console.log('invalid key word:' + this.suggestionValue.title);
    }
  }
  redirect(url:string){
    window.location.href=url;
  }
  async PageEvents(event: PageEvent){
    const pageSize = +event.pageSize; 
    const currentPage = +event.pageIndex; 
    const pagination = {
      searchQuery: '',
      pageSize: pageSize,
      token: ''
    };
  await this.getSearchResult(currentPage, pageSize);
  }
  async getSearchResult(currentPage: number, pageSize: number){
     try{
      const keyword = this.suggestionValue.title != undefined ? this.suggestionValue.title : this.suggestionValue;
      const resultPage = await this.apiClient.get<SearchResultPage>({
        url: ApiConstants.SEARCH_RESULT_URL,
        params: {
          page: currentPage,
          pageSize: pageSize, 
          keyword: keyword
        }
      });
      if(resultPage){
        this.totalLength = resultPage.totalElements;
        this.searchList = resultPage.content;
      }
    } catch(err){
      console.log('invalid key word:' + this.suggestionValue.title);
    }
  }
}
export interface SearchSuggestion {
  id: number;
  title: string;
  tags: string;
  text: string;
  submissionDate: Date;
  url: string;
}

export interface SearchResultPage {
  content:[SearchSuggestion];
  pageable: any;
  totalElements: number;
  totalPages: number;
}

