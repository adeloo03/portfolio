# Copy to settings.psd1 (git-ignored) and fill in.
@{
    # SSH target — an alias from ~/.ssh/config works (with the key set there).
    Server     = 'homelab'
    # Where backup.sh writes on the server.
    RemoteDir  = '/srv/homelab/backups'
    # The homelab/ folder of this repo on the server.
    RemoteRepo = '~/portfolio/homelab'
    # Local copies on this PC.
    LocalDir   = 'C:\Backups\homelab'
    # age private key, created with: age-keygen -o <path>
    # Only on this PC. Keep a second copy offline (USB stick, password manager):
    # without it no backup can be read.
    AgeKey     = 'C:\Users\you\.age\homelab-key.txt'
    # Number of backups to keep locally.
    Keep       = 30
}
