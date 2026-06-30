'use client';

import React from 'react';
import FleetDetails from '@/components/fleet/FleetDetails';

export default function page({ params }) {
  const fleetId = params?.id; 
  const operatorId =params?.id;   // ✅ params only here
  
  return (
    <div>
      <FleetDetails fleetId={fleetId} operatorId={operatorId} />
    </div>
  );
}




