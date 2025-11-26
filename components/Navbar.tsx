import { Sun, Moon } from 'lucide-react'

const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-center gap-8 sm:gap-4 backdrop-blur-lg bg-black/80">
            <div className="hidden sm:flex w-1/3 pl-10 flex-row">
                <img src="/analytica_logo1-white.png" alt="logo" className='w-10 h-10' />
                <img src="/text-logo-white.png" alt="logo" className='w-auto h-10 pt-1' />
            </div>
            <div className="sm:w-1/3 flex items-center justify-center gap-5">
                <a href="#home" className='text-white text-md cursor-pointer hover:text-gray-200'>Home</a>
                <a href="#about" className='text-white text-md cursor-pointer hover:text-gray-200'>About</a>
                <a href="#projects" className='text-white text-md cursor-pointer hover:text-gray-200'>Projects</a>
                <a href="#contact" className='text-white text-md cursor-pointer hover:text-gray-200'>Contact</a>
            </div>
            <div className="sm:w-1/3">
                <div className="flex flex-row items-center justify-end gap-2 pr-0 sm:pr-10">
                    <Sun className='w-6 h-6 text-white cursor-pointer hover:text-gray-200' />
                    <Moon className='w-6 h-6 text-white cursor-pointer hover:text-gray-200' />
                </div>
            </div>
        </div>
    )
}

export default Navbar