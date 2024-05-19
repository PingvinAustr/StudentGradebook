import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for notifications
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslationService } from 'src/app/services/translation/translation-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
   animations: [
    trigger('fadeAnimation', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', [
        animate('1s')
      ]),
      transition('hidden => visible', [
        animate('1s')
      ]),
    ]),
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showRegistrationForm = false;


  images = [
    './../../../assets/images/login-page-image1.png',
    './../../../assets/images/login-page-image2.png',
    './../../../assets/images/login-page-image3.png'
  ];
  currentImage = this.images[0];
  currentIndex = 0;
  fadeTrigger = 'visible';

  constructor(private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    public translationService: TranslationService) { }


  ngOnInit() {
    this.translationService.setCurrentLanguage('UA');
    this.beginLoginImageAnimation();
  }

  beginLoginImageAnimation() {
     setInterval(() => {
      this.fadeTrigger = 'hidden';
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.currentImage = this.images[this.currentIndex];
        this.fadeTrigger = 'visible';
      }, 1000);
    }, 30000);
  }

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.snackBar.open(this.translationService.translate('lblLoginSuccessful'), 
        this.translationService.translate('lblClose'), { duration: 3000 });
        this.router.navigate(['/dashboard']); // Navigate upon successful login
      },
      error: (error) => {
        this.snackBar.open(this.translationService.translate('lblLoginFailed'), this.translationService.translate('lblClose'), { duration: 3000 });
        console.error('Login failed', error);
      }
    });
  }

  toggleForm(): void {
    this.showRegistrationForm = !this.showRegistrationForm;
  }

  handleRegistration(): void {
    this.showRegistrationForm = false;
    this.snackBar.open(this.translationService.translate('lblRegistrationSuccessful'), this.translationService.translate('lblClose'), { duration: 3000 });
  }

  setLanguage(lang: string) {
    this.translationService.setCurrentLanguage(lang);
  }
}
