# Burger Space Invaders - Justfile Commands

# Default recipe to show available commands
default:
    @just --list

# Start a local development server
# Run local server on port 8081 instead of 8080 since 8080 is in use
serve:
    python3 -m http.server 8081

# Clean build artifacts (if any)
clean:
    rm -rf dist

# Future recipes for the post-MVP phase
build:
    echo "Building project (placeholder for future build process)"

lint:
    echo "Linting code (placeholder for future linting process)"

# Run tests with Jest
test:
    npm test
