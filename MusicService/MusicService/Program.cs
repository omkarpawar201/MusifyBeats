using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MusicService.Data;
using MusicService.Services;
using System.Text.Json.Serialization;

namespace MusicService
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var jwtSecret = builder.Configuration["Jwt:Secret"];

            // AUTHENTICATION (THIS LINE WAS MISSING PROPERLY)
            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.MapInboundClaims = false;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {   
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSecret)
                        ),
                        ClockSkew = TimeSpan.Zero,

                        RoleClaimType = "role",
                        NameClaimType = "sub"
                    };
                });

            builder.Services.AddAuthorization();

            // SWAGGER JWT CONFIG
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MusicService", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Paste ONLY the token (no Bearer word)"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                )
            );

            // Register DatabaseSeeder
            builder.Services.AddScoped<DatabaseSeeder>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            var app = builder.Build();

            // Seed database
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<AppDbContext>();
                    context.Database.Migrate(); // Apply migrations
                    
                    var seeder = services.GetRequiredService<DatabaseSeeder>();
                    await seeder.SeedAsync();
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            app.UseCors("AllowAll");

            // Enable static file serving for uploads
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthentication();   // MUST be before authorization
            app.UseAuthorization();

            app.MapControllers();

            // DEBUG: List all registered routes
            app.Lifetime.ApplicationStarted.Register(() =>
            {
                var endpoints = app.Services.GetRequiredService<IEnumerable<EndpointDataSource>>()
                    .SelectMany(ds => ds.Endpoints)
                    .OfType<RouteEndpoint>();

                foreach (var endpoint in endpoints)
                {
                    Console.WriteLine($"DEBUG ROUTE: {endpoint.RoutePattern.RawText} -> {endpoint.DisplayName}");
                }
            });

            app.Run();
        }
    }
}
