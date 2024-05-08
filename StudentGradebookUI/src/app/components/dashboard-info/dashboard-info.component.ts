import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/models/assignment.model';
import { AssignmentService } from 'src/app/services/assignments/assignment-service.service';
import { UserService } from 'src/app/services/user/user-service.service';
@Component({
  selector: 'app-dashboard-info',
  templateUrl: './dashboard-info.component.html',
  styleUrls: ['./dashboard-info.component.scss']
})
export class DashboardInfoComponent implements OnInit {

 constructor(private assignmentService: AssignmentService, private userService: UserService) {}

  ngOnInit(): void {
    const studentId = this.userService.getUser();
    console.log(studentId);
  }

}
