import React from 'react';
import Icon from '@/src/components/V2/UI/Icon';
import { IconsType } from '@/src/components/V2/UI/Icon/types';
import { ICONS } from './icons';

const Icons = () => {

  return (
    <div className="max-w-[80rem] mx-auto my-[10rem]">
      {
        ICONS.map((iconGroup, index) => (
          <div key={index} className="!mb-10">
            <h6 className="text-white text-lg !mb-6 font-semibold">{iconGroup.title}</h6>
            <section className="grid w-full items-start gap-8 grid-cols-12">
              {
                iconGroup.icons.map((icon, index) => (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span key={index} className="bg-neutral-500 flex items-center justify-center rounded-xl text-white !text-xl w-16 h-16">
                      <Icon type="regular" name={icon as IconsType} />
                    </span>
                    <p className="!m-0 text-sx text-white line-clamp-1">{icon}</p>
                  </div>
                ))
              }
            </section>
          </div>
        )
      )}
    </div>
  );
};

export default Icons
