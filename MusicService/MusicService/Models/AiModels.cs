namespace MusicService.Models
{
    public class AiRequest
    {
        public string Prompt { get; set; }
    }

    public class AiResponse
    {
        public string SuggestedName { get; set; }
        public string SuggestedDescription { get; set; }
        public int GenreId { get; set; }
        public int MoodId { get; set; }
        public string Reasoning { get; set; }
    }
}
