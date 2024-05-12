using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

public class TickTackService : BackgroundService
{
    private readonly IHubContext<TickTackHub> _hubContext;

    public TickTackService(IHubContext<TickTackHub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "tick-tack");
            await Task.Delay(3000, stoppingToken);
        }
    }
}
