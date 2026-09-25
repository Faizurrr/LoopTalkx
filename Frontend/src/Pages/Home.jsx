import React from 'react';
import SideBar from "../Components/Common/SideBar";
import BodySection from './BodySection';

import  HeroSection from './HeroSection'
export default function Home() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
         <HeroSection/>
        <BodySection />
      </div>
    </div>
  );
}