// import CabVerification from '@/components/fleet/CabVerification'
// import React from 'react'

// const page = ({ params }) => {

//     const { id } = params;

//   return (
//     <div>
//         <CabVerification  id={id} />
//     </div>
//   )
// }

// export default page
'use client'
import CabVerification from '@/components/fleet/CabVerification';
import React from 'react'
const page = ({ params }) => {
  const { fleetId } = params;

  return <CabVerification id={fleetId} />;
};

export default page;