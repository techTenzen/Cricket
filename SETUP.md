# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/cricket-equipment?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

### Alternative - Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Quick Test Database Setup

Use this temporary connection string for testing:
```env
MONGODB_URI=mongodb://localhost:27017/cricket-equipment
```

Then start MongoDB service or use MongoDB Atlas.