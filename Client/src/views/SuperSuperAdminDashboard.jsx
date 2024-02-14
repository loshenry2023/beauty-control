import React, { useEffect, useState } from 'react'
import SSadminNavBar from '../components/SSadminNavBar'
import ControlCompany from '../components/ControleCompany'


const SuperSuperAdminDashboard = () => {



  return (
    <>
      <SSadminNavBar />
      <div className='w-2/3 m-auto pt-8'>
        <ControlCompany />
      </div>
    </>

  )
}

export default SuperSuperAdminDashboard
