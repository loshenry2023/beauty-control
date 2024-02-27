import React from 'react'
import SSadminNavBar from '../components/SSadminNavBar'
import ControlCompany from '../components/ControleCompany'


const SuperSuperAdminDashboard = () => {



  return (
    <>
      <div className='w-full h-screen dark:bg-darkBackground'>
      <SSadminNavBar />
      <div className='w-full pt-20'>
        <ControlCompany />
      </div>
      </div>

    </>

  )
}

export default SuperSuperAdminDashboard
