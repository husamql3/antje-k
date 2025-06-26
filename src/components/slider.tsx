'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useMemo, memo, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, EffectCoverflow } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import { Lens } from '@/components/ui/lens'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

type ImageData = {
  src: string
  name: string
  size: [number, number, number]
  type: string
}

type SliderProps = {
  images: ImageData[]
}

// Memoized X component
const X = memo(() => {
  return <span className="text-[#828282]">x</span>
})
X.displayName = 'X'

// Custom hook for responsive image quality
const useResponsiveQuality = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return {
    highQuality: isMobile ? 40 : 80,
    lowQuality: isMobile ? 15 : 50,
    isMobile,
  }
}

// Memoized slide component
const SlideContent = memo(
  ({
    image,
    index,
    activeIndex,
    hovering,
    setHovering,
    isMobile,
  }: {
    image: ImageData
    index: number
    activeIndex: number
    hovering: boolean
    setHovering: (hovering: boolean) => void
    onSlideClick: (index: number) => void
    isMobile: boolean
  }) => {
    const isActive = index === activeIndex

    return (
      <div
        className="mx-auto flex h-full w-fit transform flex-col gap-8 overflow-visible transition-all ease-out"
        style={{
          transitionDuration: isMobile ? '200ms' : '300ms',
          willChange: isActive ? 'transform' : 'auto',
        }}
      >
        <div
          className="flex items-center justify-between opacity-90 transition-opacity"
          style={{
            filter: !isActive ? (isMobile ? 'blur(2px)' : 'blur(4px) saturate(1.2)') : 'none',
            transitionDuration: isMobile ? '150ms' : '200ms',
          }}
        >
          <p
            className="text-lg font-bold text-[#1F1E13] transition-all md:text-3xl"
            style={{ transitionDuration: isMobile ? '150ms' : '200ms' }}
          >
            {image.name}
          </p>
          <p
            className="text-lg font-light text-[#1F1E13] transition-all md:text-3xl"
            style={{ transitionDuration: isMobile ? '150ms' : '200ms' }}
          >
            {image.size[0]} <X /> {image.size[1]} <X /> {image.size[2]} <span className="text-[#828282]">&quot;</span>
          </p>
        </div>

        <div
          className={`transform overflow-visible transition-all ease-out ${!isMobile ? 'hover:scale-[1.02]' : ''}`}
          style={{
            transitionDuration: isMobile ? '200ms' : '300ms',
            willChange: 'transform',
          }}
        >
          <div className="relative mx-auto flex h-[350px] w-fit items-center justify-center overflow-visible p-4 md:h-[550px] md:p-6">
            {/* Single background blur image - consistent props */}
            <Image
              src={image.src || '/placeholder.svg'}
              alt=""
              width={1200}
              height={1200}
              quality={95}
              priority={index <= 4}
              unoptimized={false}
              className="absolute top-1/2 left-1/2 aspect-square max-h-[350px] w-fit max-w-full -translate-x-1/2 -translate-y-1/2 scale-95 object-contain transition-all ease-out md:max-h-[550] md:scale-100"
              style={{
                opacity: isActive ? 0.8 : 0,
                filter: isActive ? (isMobile ? 'blur(10px) saturate(1)' : 'blur(15px) saturate(1.6)') : 'blur(0px)',
                zIndex: 0,
                transitionDuration: isMobile ? '200ms' : '300ms',
                willChange: 'opacity, filter',
              }}
            />

            {/* Single main image - consistent props, effects via CSS */}
            <div
              className="relative z-10"
              style={{
                opacity: isActive ? 1 : 0.7,
                filter: !isActive ? (isMobile ? 'blur(2px) saturate(1.1)' : 'blur(4px) saturate(1.2)') : 'none',
                transitionDuration: isMobile ? '200ms' : '300ms',
                willChange: 'opacity, filter',
              }}
            >
              {isActive ? (
                <Lens
                  hovering={hovering}
                  setHovering={setHovering}
                >
                  <Image
                    src={image.src || '/placeholder.svg'}
                    alt={image.name}
                    width={1200}
                    height={1200}
                    quality={95}
                    priority={index <= 4}
                    loading={index <= 4 ? 'eager' : 'lazy'}
                    className="aspect-square max-h-[350px] w-fit max-w-full object-contain transition-all ease-out md:max-h-[550]"
                    style={{
                      transitionDuration: isMobile ? '200ms' : '300ms',
                    }}
                  />
                </Lens>
              ) : (
                <Image
                  src={image.src || '/placeholder.svg'}
                  alt={image.name}
                  width={1200}
                  height={1200}
                  quality={95}
                  priority={index <= 4}
                  loading={index <= 4 ? 'eager' : 'lazy'}
                  className="aspect-square max-h-[350px] w-fit max-w-full object-contain transition-all ease-out md:max-h-[550]"
                  style={{
                    transitionDuration: isMobile ? '200ms' : '300ms',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className="flex justify-between opacity-90 transition-opacity"
          style={{ transitionDuration: isMobile ? '150ms' : '200ms' }}
        >
          <p
            className="text-lg font-extralight text-[#a6a6a6] transition-all md:text-2xl"
            style={{
              filter: !isActive ? (isMobile ? 'blur(2px)' : 'blur(4px) saturate(1.2)') : 'none',
              transitionDuration: isMobile ? '150ms' : '200ms',
            }}
          >
            {image.type}
          </p>

          <a
            href={image.src}
            download={`${image.name.replace(/\s+/g, '_')}_${image.size[0]}x${image.size[1]}x${image.size[2]}.jpg`}
            className="text-lg font-extralight text-[#a6a6a6] underline transition-all md:text-2xl"
            style={{
              filter: !isActive ? (isMobile ? 'blur(2px)' : 'blur(4px) saturate(1.2)') : 'none',
              transitionDuration: isMobile ? '150ms' : '200ms',
            }}
          >
            View Full Quality
          </a>
        </div>
      </div>
    )
  }
)
SlideContent.displayName = 'SlideContent'

export const Slider = memo(({ images }: SliderProps) => {
  const [hovering, setHovering] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const { isMobile } = useResponsiveQuality()

  const handleSlideClick = useCallback(
    (index: number) => {
      if (index !== activeIndex && swiperRef.current) {
        swiperRef.current.slideTo(index)
      }
    },
    [activeIndex]
  )

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }, [])

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper
  }, [])

  // Memoize swiper configuration with mobile optimizations
  const swiperConfig = useMemo(
    () => ({
      modules: [Pagination, EffectCoverflow],
      spaceBetween: isMobile ? 5 : 10,
      className: 'w-svw pb-16 overflow-visible',
      slidesPerView: 1.3 as const,
      centeredSlides: true,
      speed: isMobile ? 300 : 500,
      effect: 'coverflow' as const,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: isMobile ? 50 : 100,
        modifier: isMobile ? 1 : 2,
        slideShadows: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 1.4,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 1.4,
          spaceBetween: 45,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
      },
    }),
    [isMobile]
  )

  // Memoize slides
  const slides = useMemo(
    () =>
      images.map((image, index) => (
        <SwiperSlide
          key={image.src}
          className="mr-0 overflow-visible transition-all ease-out"
          onClick={() => handleSlideClick(index)}
          style={{
            cursor: index !== activeIndex ? 'pointer' : 'default',
            transitionDuration: isMobile ? '200ms' : '300ms',
          }}
        >
          <SlideContent
            image={image}
            index={index}
            activeIndex={activeIndex}
            hovering={hovering}
            setHovering={setHovering}
            onSlideClick={handleSlideClick}
            isMobile={isMobile}
          />
        </SwiperSlide>
      )),
    [images, activeIndex, hovering, setHovering, handleSlideClick, isMobile]
  )

  return (
    <>
      <div className="relative mx-auto flex h-full flex-1 items-center justify-center overflow-visible">
        <Swiper
          {...swiperConfig}
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiper}
        >
          <div className="w-full overflow-visible">{slides}</div>
        </Swiper>
      </div>

      <div className="flex flex-col items-center gap-4 pb-5">
        <a
          href="mailto:antkrueg@icloud.com"
          className="font-source-serif font-light text-[#828282] underline transition-colors duration-300 hover:text-[#1F1E13]"
        >
          antkrueg@icloud.com
        </a>
      </div>
    </>
  )
})
Slider.displayName = 'Slider'
