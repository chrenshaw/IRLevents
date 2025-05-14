import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Replace with actual Meetup API integration
      const events = [
        { id: 1, name: 'Meetup Event 1', location: 'New York', date: '2025-05-01' },
        { id: 2, name: 'Meetup Event 2', location: 'San Francisco', date: '2025-05-10' },
      ];
      res.status(200).json(events);
    } catch {
      res.status(500).json({ error: 'Failed to fetch Meetup events' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}