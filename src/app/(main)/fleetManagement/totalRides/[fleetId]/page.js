'use client';

import React from 'react';
import TotalRides from '@/components/fleet/TotalRides';

export default function page ({ params })  {
  const {fleetId} = params;
  return (
    <div>
        <TotalRides fleetId={fleetId} />
    </div>
  );
}