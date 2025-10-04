#!/bin/bash

# Deploy script for DigitalOcean server
# This script sets up the server for Docker deployment

set -e

echo "🚀 Setting up DigitalOcean server for Docker deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose already installed"
fi

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/grupodapaz-web
sudo chown $USER:$USER /opt/grupodapaz-web

# Create environment file template
echo "⚙️ Creating environment file template..."
cat > /opt/grupodapaz-web/.env << EOF
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Configuration
DATABASE_URL=your_postgresql_database_url_here

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Resend Email Service (Optional)
RESEND_API_KEY=your_resend_api_key_here

# Application Configuration
NODE_ENV=production
PORT=5000
EOF

# Create docker-compose.prod.yml
echo "🐳 Creating production docker-compose file..."
cat > /opt/grupodapaz-web/docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  app:
    image: ghcr.io/your-username/grupodapaz-web:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
    volumes:
      - ./attached_assets:/app/attached_assets
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# Create systemd service for auto-start
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/grupodapaz-web.service > /dev/null << EOF
[Unit]
Description=Grupo da Paz Web Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/grupodapaz-web
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl enable grupodapaz-web.service

# Create assets directory
mkdir -p /opt/grupodapaz-web/attached_assets

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable

# Create deploy script
echo "📝 Creating deploy script..."
cat > /opt/grupodapaz-web/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Deploying Grupo da Paz Web Application..."

# Login to GitHub Container Registry
echo "🔐 Logging in to GitHub Container Registry..."
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Pull the latest image
echo "📥 Pulling latest image..."
docker pull ghcr.io/$GITHUB_USERNAME/grupodapaz-web:latest

# Stop existing container
echo "🛑 Stopping existing container..."
docker-compose -f docker-compose.prod.yml down || true

# Start new container
echo "▶️ Starting new container..."
docker-compose -f docker-compose.prod.yml up -d

# Clean up old images
echo "🧹 Cleaning up old images..."
docker image prune -f

# Show status
echo "📊 Container status:"
docker ps

echo "✅ Deployment completed successfully!"
EOF

chmod +x /opt/grupodapaz-web/deploy.sh

echo ""
echo "🎉 Server setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /opt/grupodapaz-web/.env with your actual environment variables"
echo "2. Update the image name in docker-compose.prod.yml with your GitHub username"
echo "3. Configure GitHub secrets in your repository:"
echo "   - DO_HOST: $(curl -s ifconfig.me)"
echo "   - DO_USERNAME: $USER"
echo "   - DO_SSH_KEY: (your private SSH key)"
echo "   - GITHUB_TOKEN: (your GitHub personal access token)"
echo ""
echo "🔗 Your application will be available at: http://$(curl -s ifconfig.me):5000"
echo ""
echo "💡 To start the service manually: sudo systemctl start grupodapaz-web"
echo "💡 To check service status: sudo systemctl status grupodapaz-web"
echo "💡 To view logs: docker-compose -f /opt/grupodapaz-web/docker-compose.prod.yml logs -f"
