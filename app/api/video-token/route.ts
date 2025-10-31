import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export async function POST(request: NextRequest) {
  try {
    const { identity, roomName } = await request.json();

    if (!identity || !roomName) {
      return NextResponse.json(
        { error: 'Identity and room name are required' },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    console.log('Twilio Credentials Check (Using Account SID + Auth Token):');
    console.log('Account SID:', accountSid ? `${accountSid.substring(0, 10)}...` : 'MISSING');
    console.log('Auth Token:', authToken ? 'EXISTS' : 'MISSING');
    console.log('Identity:', identity);
    console.log('Room Name:', roomName);

    if (!accountSid || !authToken) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      );
    }

    // Create an access token using Account SID + Auth Token (better for Trial accounts)
    const token = new AccessToken(
      accountSid,
      accountSid, // Use Account SID as API Key for Trial accounts
      authToken, // Use Auth Token as API Secret
      {
        identity: identity,
        ttl: 14400, // Token valid for 4 hours
      }
    );

    // Create a video grant
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Add the grant to the token
    token.addGrant(videoGrant);

    // Serialize the token to a JWT
    const jwt = token.toJwt();

    console.log('Token generated successfully for identity:', identity);

    return NextResponse.json({ token: jwt, roomName });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate video token' },
      { status: 500 }
    );
  }
}
