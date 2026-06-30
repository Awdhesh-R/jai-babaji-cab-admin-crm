// import TotalDrivers from '@/components/fleet/TotalDrivers'
// import React from 'react'

// const page = () => {

//     return (
//         <TotalDrivers driver={drivers} />
//     )
// }

// export default page


'use client';

import React from 'react';
import TotalDrivers from '@/components/fleet/TotalDrivers'

export default function page ({ params })  {
  const {fleetId} = params;
  return (
    <div>
        <TotalDrivers fleetId={fleetId} />
    </div>
  );
}