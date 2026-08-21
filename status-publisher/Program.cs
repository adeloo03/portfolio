using StatusPublisher;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddHttpClient();
        services.AddHostedService<PublisherWorker>();
    })
    .Build();

await host.RunAsync();
