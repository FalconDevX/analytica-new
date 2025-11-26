import React from 'react'

const Projects = () => {
    return (
        <div className='appear w-full min-h-[90vh] flex flex-col items-center justify-start'>
            <h1 className='text-2xl p-6'>Projects</h1>
            <div className="flex flex-row gap-5">
                <div className="max-w-xl">
                    <h3 className="text-white text-lg p-3">Developers’ Chat</h3>
                    <div className="relative inline-block p-3">

                        <img
                            src="project-geo.png"
                            className="w-full h-auto object-contain"
                        />

                        {/* górny lewy */}
                        <span className="absolute top-0 left-0 w-[20px] h-[3px] bg-white"></span>
                        <span className="absolute top-0 left-0 w-[3px] h-[20px] bg-white"></span>

                        {/* dolny prawy */}
                        <span className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-white"></span>
                        <span className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-white"></span>
                    </div>

                    <p className="text-white text-md p-3">This project aims to create an application for developers utilizing language models. Users will be able to specify geographic parameters for a plot (such as proximity to water bodies, terrain layout, sun positioning, plot size, location, etc.), which will then be processed by a language model. <br /> <br /> Based on data from databases, maps and solar positioning, the application will ultimately return a selection of plots that meet the specified criteria.</p>
                </div>
                <div className="max-w-xl">
                    <h3 className="text-white text-lg p-3">Developers’ Chat</h3>
                    <div className="relative inline-block p-3">

                        <img
                            src="project-trade.png"
                            className="w-full h-auto object-contain"
                        />

                        {/* górny lewy */}
                        <span className="absolute top-0 left-0 w-[20px] h-[3px] bg-white"></span>
                        <span className="absolute top-0 left-0 w-[3px] h-[20px] bg-white"></span>

                        {/* dolny prawy */}
                        <span className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-white"></span>
                        <span className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-white"></span>
                    </div>

                    <p className="text-white text-md p-3">This project aims to create an application for developers utilizing language models. Users will be able to specify geographic parameters for a plot (such as proximity to water bodies, terrain layout, sun positioning, plot size, location, etc.), which will then be processed by a language model. <br /> <br /> Based on data from databases, maps and solar positioning, the application will ultimately return a selection of plots that meet the specified criteria.</p>
                </div>
            </div>
        </div>
    )
}

export default Projects