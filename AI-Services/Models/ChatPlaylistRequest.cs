namespace AI_Services.Models
{
    public class ChatPlaylistRequest
    {
        public required string Prompt { get; set; }
        public int MaxSongs { get; set; } = 50;
    }
}
