
using AI_Services.Models;
using Microsoft.EntityFrameworkCore;
namespace AI_Services.Data
{
    
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options)
                : base(options)
            {
            }

            public DbSet<Song> Songs { get; set; } = null!;
        }
    

}
