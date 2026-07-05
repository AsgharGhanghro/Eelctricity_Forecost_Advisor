#!/bin/bash

# Electricity Usage Advisor - Startup Script

echo "=================================================="
echo "  Electricity Usage Advisor - Startup Script"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   (the directory containing 'server' and 'client' folders)"
    exit 1
fi

# Check Python installation
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Error: Python is not installed"
    echo "   Please install Python 3.7 or higher"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "✅ Python found: $PYTHON_CMD"
echo ""

# Install dependencies
echo "📦 Installing Python dependencies..."
cd server
$PYTHON_CMD -m pip install -r requirements.txt --quiet

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    echo "   Try running: pip install -r server/requirements.txt"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Start the Flask server
echo "🚀 Starting Flask backend server..."
echo "   Server will be available at: http://localhost:5000"
echo ""
echo "💡 To access the application:"
echo "   1. Keep this terminal window open"
echo "   2. Open client/index.html in your web browser"
echo "   OR"
echo "   3. In another terminal, run: python -m http.server 8000"
echo "      Then open: http://localhost:8000"
echo ""
echo "=================================================="
echo ""

# Start the server
$PYTHON_CMD app.py