import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Button from '../../components/Button';
import EncryptedData from '../../js/EncryptedData';
import { useLocation } from 'wouter';

const Welcome = ({}) => {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();

  const slides = [
    {
      title: t('welcome.slide1.title'),
      description: t('welcome.slide1.description'),
    },
    {
      title: t('welcome.slide2.title'),
      description: t('welcome.slide2.description'),
    },
    {
      title: t('welcome.slide3.title'),
      description: t('welcome.slide3.description'),
    },
  ];

  const handleStart = () => {
    const encryptedData = new EncryptedData();
    encryptedData.init();

    encryptedData.save();

    setLocation('/welcome/password');
  };

  return (
    <div className='w-full flex flex-col bg-white overflow-hidden'>
      <Swiper modules={[Pagination]} pagination={{ clickable: true }} className='h-100vh w-full'>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className='h-0.7 flex flex-col items-center justify-start py-5 px-5 text-center mt-[20vh]'>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>{slide.title}</h2>
              <p className='text-base text-gray-600 leading-relaxed max-w-[80%]'>
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='max-w-2xl mx-auto p-5 py-10 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80'>
        <Button onClick={handleStart} fullWidth>
          {t('welcome.start')}
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
