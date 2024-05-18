import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:7196/tickTackHub", {
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets 
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();

      this.hubConnection.start()
          .then(() => console.log('Connection started'))
          .catch(err => console.error('Error while starting connection: ' + err));
  }

  public addTickTackListener = (tickTackHandler: (message: string) => void) => {
    this.hubConnection.on('ReceiveMessage', (message) => {
      tickTackHandler(message);
    });
  }
}
