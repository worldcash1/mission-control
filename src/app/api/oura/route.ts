import { NextRequest, NextResponse } from 'next/server';

const OURA_BASE_URL = 'https://api.ouraring.com/v2/usercollection';

const ENDPOINT_MAP: Record<string, string> = {
  daily_sleep: 'daily_sleep',
  sleep: 'sleep',
  daily_readiness: 'daily_readiness',
  daily_activity: 'daily_activity',
  heartrate: 'heartrate',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!type || !ENDPOINT_MAP[type]) {
    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  }

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Missing start or end date' },
      { status: 400 }
    );
  }

  const token = process.env.OURA_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'OURA_TOKEN not configured' },
      { status: 500 }
    );
  }

  try {
    const endpoint = ENDPOINT_MAP[type];
    const dateParam = type === 'heartrate' ? 'start_datetime' : 'start_date';
    const endParam = type === 'heartrate' ? 'end_datetime' : 'end_date';
    
    const url = `${OURA_BASE_URL}/${endpoint}?${dateParam}=${start}&${endParam}=${end}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Oura API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch from Oura API', data: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Oura:', error);
    return NextResponse.json(
      { error: 'Internal server error', data: [] },
      { status: 500 }
    );
  }
}
