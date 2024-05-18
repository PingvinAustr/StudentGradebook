using Microsoft.Extensions.Hosting;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Polly;
using Polly.Retry;

namespace StudentGradebookWebAPI.Services
{

    public class WeeklyRequestService : BackgroundService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private AsyncRetryPolicy _retryPolicy;

        public WeeklyRequestService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _retryPolicy = Policy.Handle<HttpRequestException>()
                                 .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromDays(7), stoppingToken);
                await _retryPolicy.ExecuteAsync(async () =>
                {
                    await SendRequestAsync();
                });
            }
        }

        private async Task SendRequestAsync()
        {
            var client = _httpClientFactory.CreateClient();
            var httpResponse = await client.PostAsync("http://serverforuniversitydataretrieval.com", new StringContent(""));
            if (!httpResponse.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Failed to send POST request: {httpResponse.StatusCode}");
            }
            Console.WriteLine("Request sent successfully.");
            // UpdateDatabaseContextWithResponseData();
        }
    }

}
