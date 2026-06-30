"use client";
import React from 'react'
import CabOverview from '@/components/rbCabs/CabOverview'
import { useParams } from 'next/navigation';

const Page = () => {
  console.log(
    "caboverview"
  );
  const {id: cab_id} = useParams();
  return (
    <div>
      {/* hiii hello  */}
      <CabOverview  cab_id={cab_id}/>
    </div>
  )
}

export default Page