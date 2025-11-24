import React from 'react'

const About = () => {
  return (
    <div className='appear w-full min-h-[60vh] flex flex-col items-center'>
        <h1 className='text-2xl p-6'>About Us</h1>
        <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/2 px-5">
                <p className="text-white text-md max-w-xl">AGH Analytica is a newly established student organization at AGH University of Science and Technology, bringing together enthusiasts of data analysis and cutting-edge technologies. <br /> <br /> Our activities focus on innovative projects that allow members to develop their skills in satellite imagery and map analysis, stock market data analysis, image analysis and working with Large Language Models (LLMs).</p>
            </div>
            <div className="w-full md:w-1/2 px-5">
            <img src="/ekipa.jpg" alt="About Us" className="h-100 w-auto object-contain object-top" />
            </div>
        </div>
    </div>
  )
}

export default About