import React from 'react'
import { screen1 } from "../../assets"
import Carousel from "react-material-ui-carousel";

const StartCarousel = () => {

    const carouselItems = [
        { img: screen1,
            title: 'Organize your research workflow',
            subtitle: 'Easy automation for busy people. Useful moves info between your web apps\n' +
                'automatically, so you can focus'
        },
        { img: screen1,
            title: 'Organize your research workflow',
            subtitle: 'Easy automation for busy people. Useful moves info between your web apps\n' +
                'automatically, so you can focus'
        },
        { img: screen1,
            title: 'Organize your research workflow',
            subtitle: 'Easy automation for busy people. Useful moves info between your web apps\n' +
                'automatically, so you can focus'
        }
    ];

    return (
        <div className='flex-1 bg-gray-100 hidden md:flex flex-col items-center justify-center'>
            <Carousel
                className="flex flex-col items-center justify-center w-full mt-[-40px]"
                autoPlay={true}
                animation="slide"
                indicators={true}
                indicatorIconButtonProps={{
                    style: {
                        padding: '6px',
                    }
                }}
                activeIndicatorIconButtonProps={{
                    style: {
                        color: '#5131D7'
                    }
                }}
                navButtonsAlwaysInvisible={true}
                index={0}
            >
                {carouselItems.map((item, ind) => (
                    <div
                        className="w-auto px-28 flex flex-col justify-center items-center h-[500px]"
                        key={ind}
                    >
                        <img
                            className="w-[400px] h-auto cursor-pointer object-contain"
                            src={item.img}
                            alt={item.title}
                        />
                        <span className="mt-14 font-semibold text-xl md:text-3xl">{item.title}</span>
                        <span className="mt-8 text-sm text-center">{item.subtitle}</span>
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default StartCarousel