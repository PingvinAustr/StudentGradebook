using Microsoft.AspNetCore.SignalR;

public class TickTackHub : Hub
{
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}
