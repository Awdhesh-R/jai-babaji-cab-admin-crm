'use client'
import React from 'react'
import DriverDetails from '@/components/rbDriver/DriverDetails'
import { useParams } from 'next/navigation'

const DriverDetailsPage = () => {
  const { id } = useParams();
  return (
    <div>
        <DriverDetails id={id} />
    </div>
  )
}

export default DriverDetailsPage;