#!/bin/bash

# Local development script
# This script helps you run the application locally with Docker

set -e

echo "🚀 Starting Grupo da Paz Web Application locally..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your actual environment variables"
    echo "   Then run this script again."
    exit 1
fi

# Build and start the application
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

echo ""
echo "✅ Application started successfully!"
echo ""
echo "🌐 Your application is available at:"
echo "   - Frontend: http://localhost:5000"
echo "   - Database: localhost:5432"
echo ""
echo "📊 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop application: docker-compose down"
echo "   - Restart application: docker-compose restart"
echo "   - Access database: docker-compose exec postgres psql -U postgres -d grupodapaz"
echo ""
echo "🔧 Development commands:"
echo "   - Run database migrations: npm run db:push"
echo "   - Install dependencies: npm install"
echo "   - Run development server: npm run dev"
