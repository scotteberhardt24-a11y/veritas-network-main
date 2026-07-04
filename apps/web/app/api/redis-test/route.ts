import { createClient } from 'redis';

export async function GET() {
  try {
    const client = createClient({
      url: process.env.REDIS_PUBLIC_URL,
    });

    await client.connect();
    await client.set('test-key', 'hello-from-veritas');
    const value = await client.get('test-key');
    await client.disconnect();

    return Response.json({ success: true, value });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
