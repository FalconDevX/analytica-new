import React from 'react'

const Projects = () => {
    return (
        <div className='appear w-full min-h-[90vh] flex flex-col items-center justify-start'>
            <h1 className='text-2xl p-6'>Projects</h1>
            <div className="flex flex-row gap-5">
                <div className='max-w-xl  text-center'>
                    <h3 className='text-white text-lg p-3'>Developers’ Chat</h3>
                    <img src="project-geo.png" alt="Project 1" className="w-full h-auto object-contain"></img>
                    <p className='text-white text-md p-3'>This project aims to create an application for developers utilizing language models. Users will be able to specify geographic parameters for a plot (such as proximity to water bodies, terrain layout, sun positioning, plot size, location, etc.), which will then be processed by a language model. Based on data from databases, maps and solar positioning, the application will ultimately return a selection of plots that meet the specified criteria.</p>
                </div>
                <div className='max-w-xl  text-center'>
                    <h3 className='text-white text-lg p-3'>Analytica Investments</h3>
                    <img src="project-trade.png" alt="Project 2" className="w-full h-auto object-contain"></img>
                    <p className='text-white text-md p-3'>This project aims to develop an application that uses algorithms to provide advice on stock market investments. We also plan to expand the program with an AI module designed to learn and make independent trading decisions.</p>
                </div>
            </div>
        </div>
    )
}

export default Projects