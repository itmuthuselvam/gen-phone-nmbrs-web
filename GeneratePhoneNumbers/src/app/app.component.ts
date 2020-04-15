import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PhoneNumberRqst } from './model/phoneNumberRqst';
import { environment } from './../environments/environment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';


const headerInfo = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


@Injectable({providedIn:'root'})
export class AppComponent implements OnInit {

  phoneNumberForm: FormGroup;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private _http: HttpClient, private formBuilder: FormBuilder) {
    console.log('Prod environment:::', environment.production);
  }

  title = 'GenPhoneNumbers';
  phoneNumber: string;
  phoneNumbersArray: any;
  phoneNumberRqst: PhoneNumberRqst = new PhoneNumberRqst();
  pageNumber = 0;
  pageSize = 10;
  totalElements = 0;
  showNoOfElements = true;

  baseApiUrl = 'http://localhost:8080/';
  dataSource1 =  new MatTableDataSource();
  displayedColumns: string[] = ['PhoneNumbers'];

  ngOnInit() {
    this.phoneNumberForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required]], 
    });
    this.dataSource1 = new MatTableDataSource(this.phoneNumbersArray);
  }

  onSubmit() {
    console.log('Submitted phone', this.phoneNumberForm.get('phoneNumber').value);
    this.phoneNumberRqst.phoneNumber = this.phoneNumberForm.get('phoneNumber').value;
    this.generatePhoneNumbers(this.phoneNumberRqst);
  }

  generatePhoneNumbers(phoneNumberRqst: PhoneNumberRqst) {
        console.log('Inside getPhoneNumbers ');
        const header = { 'content-type': 'application/json'};
        const body = JSON.stringify(phoneNumberRqst);

        this._http.post(this.baseApiUrl, body, headerInfo).subscribe({
        next: data => {
                          this.totalElements = data["totalElements"];
                          this.showNoOfElements = this.totalElements > 0 ? false : true;
                          this.phoneNumbersArray = data;
                          console.log("Response ::",this.phoneNumbersArray);
                          this.dataSource1 = new MatTableDataSource(this.phoneNumbersArray);
                        },
        error: error => console.log('There was an error!', error)
        });
    }

  pageEvent(pageData: any) {
    this.pageNumber = pageData.pageIndex;
    this.pageSize = pageData.pageSize;
    this.phoneNumberRqst.page = this.pageNumber;
    this.phoneNumberRqst.size = this.pageSize;
    this.generatePhoneNumbers(this.phoneNumberRqst);
  }

}
