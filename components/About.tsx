import React from 'react'

const About = () => {
  return (
    <div id="about" className="appear w-full min-h-[60vh] flex flex-col items-center scroll-mt-15">
      <h1 className="text-2xl p-6">About Us</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 px-5 flex justify-center md:justify-end">
          <p className="text-white text-md max-w-xl">AGH Analytica is a newly established student organization at AGH University of Science and Technology, bringing together enthusiasts of data analysis and cutting-edge technologies. <br /> <br /> Our activities focus on innovative projects that allow members to develop their skills in satellite imagery and map analysis, stock market data analysis, image analysis and working with Large Language Models (LLMs).</p>
        </div>
        <div className="w-full md:w-1/2 px-5">
          <div className="relative inline-block p-3">
            <img src="/ekipa.jpg" alt="About Us" className="h-auto w-auto object-contain object-top" />

            {/* górny lewy */}
            <span className="absolute top-0 left-0 w-[20px] h-[3px] bg-white"></span>
            <span className="absolute top-0 left-0 w-[3px] h-[20px] bg-white"></span>

            {/* dolny prawy */}
            <span className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-white"></span>
            <span className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-white"></span>

          </div>
        </div>
      </div>
    </div>
  )
}

export default About