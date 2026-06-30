'use client';
 import WalletAmount from '@/components/fleet/WalletAmount';
import React from 'react'

 const page = ({params}) => {
   const operatorId =params?.id;
  
   return (
    <div>
       
        <WalletAmount operatorId={operatorId} />

     </div>
  )
 }

 export default page

