'use client';

import React from 'react';
import TotalCabs from '@/components/fleet/TotalCabs';

export default function page ({ params })  {
  const {fleetId} = params;
  return (
    <div>
        <TotalCabs fleetId={fleetId} />
    </div>
  );
}

