import { NextResponse } from 'next/server';

// Temporarily disabling Eventbrite API integration
// export async function GET() {
//   const apiKey = process.env.EVENTBRITE_API_TOKEN;
//   const url = `https://www.eventbriteapi.com/v3/events/search/?token=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Eventbrite API error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching Eventbrite API:', error);
//     return NextResponse.json({ error: 'Failed to fetch Eventbrite events' }, { status: 500 });
//   }
// }