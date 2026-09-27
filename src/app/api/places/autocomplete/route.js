import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');

    if (!input) {
        return NextResponse.json({ success: false, message: 'Input is required' }, { status: 400 });
    }

    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:in`);
        const data = await response.json();

        if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
            const predictions = data.predictions.map(p => ({
                description: p.description,
                place_id: p.place_id,
                reference: p.reference,
                structured_formatting: p.structured_formatting
            }));
            return NextResponse.json({ success: true, predictions, status: 'ok' });
        } else {
            return NextResponse.json({ success: false, message: data.error_message || data.status }, { status: 400 });
        }
    } catch (error) {
        console.error('Google Maps API Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch autocomplete suggestions' }, { status: 500 });
    }
}
