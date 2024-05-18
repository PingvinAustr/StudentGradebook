import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { CafedraService } from 'src/app/services/cafedra/cafedra.service';
import { Group } from 'src/app/models/group.model';
import { Cafedra } from 'src/app/models/cafedra.model';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent {
  @Output() onRegistered = new EventEmitter<void>();
  @Output() onGoBack = new EventEmitter<void>();
  groups: Group[] = [];
  cafedras: Cafedra[] = [];

  student = {
    username: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    groupId: null
  };

  teacher = {
    username: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    cafedraId: null
  };

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private cafedraService: CafedraService,
    private router: Router
  ) {
    this.loadGroups();
    this.loadCafedras();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(groups => this.groups = groups);
  }

  loadCafedras(): void {
    this.cafedraService.getCafedras().subscribe(cafedras => this.cafedras = cafedras);
  }

  registerStudent(): void {
    this.authService.registerStudent(this.student).subscribe({
      next: (response) => {
        this.onRegistered.emit();
      },
      error: (error) => {
      }
    });
  }

  registerTeacher(): void {
    this.authService.registerTeacher(this.teacher).subscribe({
      next: (response) => {
        this.onRegistered.emit();
      },
      error: (error) => {
        console.error('Teacher registration failed', error);
      }
    });
  }

  toggleForm() {
    console.log('a"0;');
    this.onGoBack.emit();
  }
}
