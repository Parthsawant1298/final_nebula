import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request) {
    try {
        await connectDB();

        const { token } = await request.json();

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        });

        const { name, email, sub: googleId } = ticket.getPayload();

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                password: Math.random().toString(36).slice(-8) // Random password for Google users
            });
        } else {
            // Update existing user's Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        }

        return NextResponse.json(
            { 
                message: 'Google login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
        );
    }
}
