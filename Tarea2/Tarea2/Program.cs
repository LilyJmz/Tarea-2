var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseExceptionHandler("/error"); // Add error handling

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Map("/error", appBuilder =>
{
    appBuilder.Run(async context =>
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("An unexpected error occurred.");
    });
});

app.MapFallbackToFile("Login.html");

app.Run();

