using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Docker.DotNet;
using Docker.DotNet.Models;

namespace StatusPublisher;

public sealed class PublisherWorker(
    IHttpClientFactory httpClientFactory,
    ILogger<PublisherWorker> logger) : BackgroundService
{
    private static readonly TimeSpan PublishInterval = TimeSpan.FromMinutes(15);

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private readonly string _gistId  = RequireEnv("GITHUB_GIST_ID");
    private readonly string _token   = RequireEnv("GITHUB_TOKEN");

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Publish immediately on start, then every 15 minutes.
        await TryPublish(stoppingToken);

        using var timer = new PeriodicTimer(PublishInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await TryPublish(stoppingToken);
        }
    }

    private async Task TryPublish(CancellationToken ct)
    {
        try
        {
            var snapshot = await BuildSnapshot(ct);
            var json     = JsonSerializer.Serialize(snapshot, JsonOptions);
            await PatchGist(json, ct);

            logger.LogInformation(
                "Published: {Up}/{Total} services up, uptime {Days:F1}d",
                snapshot.ServicesUp, snapshot.ServicesTotal, snapshot.UptimeDays);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            // Shutting down — let it propagate.
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Publish failed; will retry in {Interval}", PublishInterval);
        }
    }

    private static async Task<StatusSnapshot> BuildSnapshot(CancellationToken ct)
    {
        var uptimeDays = ReadHostUptimeDays();
        var (up, total) = await ReadContainerCounts(ct);

        return new StatusSnapshot(
            UpdatedAt:       DateTime.UtcNow.ToString("O"),
            UptimeDays:      Math.Round(uptimeDays, 2),
            ServicesUp:      up,
            ServicesTotal:   total,
            LastIncident:    Environment.GetEnvironmentVariable("LAST_INCIDENT"),
            LastRestoreTest: Environment.GetEnvironmentVariable("LAST_RESTORE_TEST"));
    }

    private static double ReadHostUptimeDays()
    {
        // /proc/uptime is mounted read-only from the host at container start.
        var line    = File.ReadAllText("/proc/uptime");
        var seconds = double.Parse(line.Split(' ')[0], CultureInfo.InvariantCulture);
        return seconds / 86_400;
    }

    private static async Task<(int up, int total)> ReadContainerCounts(CancellationToken ct)
    {
        using var client = new DockerClientConfiguration(
            new Uri("unix:///var/run/docker.sock")).CreateClient();

        var containers = await client.Containers.ListContainersAsync(
            new ContainersListParameters { All = true }, ct);

        return (
            up:    containers.Count(c => c.State == "running"),
            total: containers.Count);
    }

    private async Task PatchGist(string content, CancellationToken ct)
    {
        var payload = new
        {
            files = new Dictionary<string, object>
            {
                ["status.json"] = new { content }
            }
        };

        var http = httpClientFactory.CreateClient();
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _token);
        http.DefaultRequestHeaders.UserAgent.Add(
            new ProductInfoHeaderValue("status-publisher", "1.0"));
        http.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));

        using var body = new StringContent(
            JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await http.PatchAsync(
            $"https://api.github.com/gists/{_gistId}", body, ct);

        response.EnsureSuccessStatusCode();
    }

    private static string RequireEnv(string name) =>
        Environment.GetEnvironmentVariable(name)
        ?? throw new InvalidOperationException(
            $"Required environment variable '{name}' is not set. " +
            "Check your .env file and restart the container.");
}
