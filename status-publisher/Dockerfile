FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src
COPY StatusPublisher.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/runtime:9.0-alpine AS final
WORKDIR /app
COPY --from=build /app .

# Run as non-root. The Docker socket mount must be group-accessible (GID 999 on most Linux hosts).
RUN addgroup --gid 999 docker 2>/dev/null || true && \
    adduser --disabled-password --gecos "" --ingroup docker appuser
USER appuser

ENTRYPOINT ["dotnet", "StatusPublisher.dll"]
