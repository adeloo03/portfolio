FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src
COPY StatusPublisher.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/runtime:9.0-alpine AS final
WORKDIR /app
COPY --from=build /app .

# Run as non-root. Docker access goes through the socket proxy, so no docker group.
RUN adduser --disabled-password --gecos "" appuser
USER appuser

ENTRYPOINT ["dotnet", "StatusPublisher.dll"]
