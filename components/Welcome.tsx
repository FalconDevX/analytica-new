import Sphere from './Sphere'

const Welcome = () => {
    return (
        <div className='w-full h-screen relative overflow-hidden'>
            <img src="/background.png" alt="Background" className="w-full absolute inset-0 m-auto z-0 pointer-events-none" />
            <Sphere />
            {/*Tło gradientowe logo*/}
            <div    
                className="absolute inset-0 m-auto pointer-events-none z-2"
                style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "80%",
                    background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 190%)",
                    filter: "blur(20px)",
                }}
            />
            {/*Logo*/}
            <img
                src="/analytica_logo1-white.png"
                className="absolute inset-0 m-auto pointer-events-none z-3 pr-5 "
                style={{
                    width: "350px",
                    height: "auto",
                }}
            />
        </div>
    )
}

export default Welcome