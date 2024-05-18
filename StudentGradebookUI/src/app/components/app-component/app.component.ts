import { Component, OnInit } from '@angular/core';
import { CafedraService } from '../../services/cafedra/cafedra.service'; // Adjust the path as necessary
import { SignalRService } from 'src/app/services/signal-r/signal-r.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'StudentGradebookUI';

  constructor(private cafedraService: CafedraService,
    private signalRService: SignalRService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.getCafedras();
    setInterval(()=>  this.colorTrace("Connected", "green"), 30000);
    this.themeService.loadTheme();
    //this.initSignalR();
  }

  colorTrace(msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
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

  initSignalR() {
    setInterval(()=> console.log('Connected...'), 3000);
    this.signalRService.startConnection();
    this.signalRService.addTickTackListener((message) => {
      console.log(message);
    });
  }
}
