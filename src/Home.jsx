import React from 'react';
import logo from './assets/logo.png';
function Home() {
  return (
    <div className='flex items-center justify-center  h-screen'>
      <div className='text-center'>
        <img src={logo} alt=""  className='w-[500px]'/>
       
      </div>
    </div>
  );
}

export default Home;
