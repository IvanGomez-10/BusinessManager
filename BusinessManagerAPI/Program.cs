using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Inicializa FirebaseApp
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile(Path.Combine(AppContext.BaseDirectory, "Config", "firebase-adminsdk.json")),
});

// Configurar CORS para permitir solicitudes desde el front-end
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000", "https://localhost:3000") // Incluye ambas variantes para desarrollo
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Configuración de servicios y controladores
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar la política de CORS antes de MapControllers
app.UseCors("AllowReactApp");

app.UseRouting();
app.MapControllers();

app.Run();
