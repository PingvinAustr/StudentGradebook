import { Component, OnInit } from '@angular/core';
import { CafedraService } from '../../services/cafedra/cafedra.service'; // Adjust the path as necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'StudentGradebookUI';

  constructor(private cafedraService: CafedraService) { }

  ngOnInit() {
    this.getCafedras();
  }

  getCafedras(): void {
    this.cafedraService.getCafedras().subscribe({
      next: (cafedras) => {
        console.log('Cafedras:', cafedras);
      },
      error: (error) => {
        console.error('Error fetching cafedras:', error);
      }
    });
  }
}
