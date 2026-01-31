using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicService.Services;

namespace MusicService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/recommendations")]
    public class RecommendationController : ControllerBase
    {
        private readonly RecommendationService _service;

        public RecommendationController(RecommendationService service)
        {
            _service = service;
        }

        [HttpGet("personalized")]
        public async Task<IActionResult> Get()
        {
            var email = User.FindFirst("email")?.Value;
            var result = await _service.GetPersonalizedRecommendations(email);
            return Ok(result);
        }
    }
}
