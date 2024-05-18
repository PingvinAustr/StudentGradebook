import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private router: Router) {}

  public handleError(error: HttpErrorResponse) {
    if (error.status === 500) {
        this.router.navigate(['/error-page'], { queryParams: { error: JSON.stringify(error) } });
    }
    return throwError('Something bad happened; please try again later.');
}
}
