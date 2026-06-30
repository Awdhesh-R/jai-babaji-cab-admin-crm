'use client'
import React from 'react'
// import FindCabs from '@/components/FindCabs/FindCabs'
import FindCabs from '@/components/fleet/FindCabs'
import { useParams } from 'next/navigation';
const FindCabPage = () => {
  const urid = useParams().urid;
  return (
    <div>
        <FindCabs urid={urid} />
    </div>
  )
}

export default FindCabPage