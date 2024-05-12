import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {
  errorMessage: string;

  constructor(private route: ActivatedRoute, private renderer: Renderer2) {}
  
 ngOnInit(): void {
   setTimeout(() => {
      this.renderer.removeClass(document.body, 'loading');
    }, 1000);

    this.route.queryParams.subscribe(params => {
      const error = params['error'];
      this.setErrorMessage(error);
    });
  }

  private setErrorMessage(error: string) {
   this.errorMessage = JSON.parse(error);
  } 
  
  showDetails: boolean = false;
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
