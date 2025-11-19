# OAuth Setup Guide

This guide explains how to set up Google and GitHub OAuth authentication for your ManaskaAI application.

## Prerequisites

1. Google Cloud Console account
2. GitHub account with developer access
3. Environment variables configured

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
# NextAuth
AUTH_SECRET=your_nextauth_secret_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# JWT Secret (for custom token generation)
JWT_SECRET=your_jwt_secret_here  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your `.env.local`

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: ManaskaAI
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env.local`

## How It Works

### Authentication Flow

1. **User clicks OAuth button** → Redirects to provider (Google/GitHub)
2. **User authorizes** → Provider redirects back to NextAuth
3. **NextAuth processes** → Creates user in database via DrizzleAdapter
4. **Custom callback** → Generates JWT token compatible with existing middleware
5. **Token stored** → HttpOnly cookie set for authentication
6. **Middleware validates** → Both JWT tokens and NextAuth sessions work

### Database Integration

- OAuth users are automatically stored in your existing `users` table
- Additional OAuth data stored in `accounts` table
- Sessions managed in `sessions` table
- Compatible with existing credential-based users

### Token Management

- OAuth users get JWT tokens (same as credential users)
- Middleware handles both NextAuth sessions and JWT tokens
- Seamless integration with existing authentication system

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google" or "Continue with GitHub"
4. Complete OAuth flow
5. Should redirect to `/dashboard` with authentication cookie set

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check OAuth app settings match your callback URLs exactly
   - Ensure no trailing slashes in URLs

2. **"OAuth app not found"**
   - Verify CLIENT_ID and CLIENT_SECRET are correct
   - Check environment variables are loaded

3. **"Session not found"**
   - Ensure SessionProvider is wrapping your app
   - Check AUTH_SECRET is set

4. **Database errors**
   - Ensure all NextAuth tables exist (users, accounts, sessions, verificationTokens)
   - Run database migrations if needed

### Debug Mode

Add to your `.env.local` for debugging:
```bash
NEXTAUTH_DEBUG=true
```

This will show detailed logs in your console.
