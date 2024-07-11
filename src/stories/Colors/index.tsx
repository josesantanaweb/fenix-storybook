import React from 'react';
import Color from './Color';

interface Color {
  value: string;
  code: string;
  label: string;
}

interface Colors {
  title: string;
  colors: Color[];
}

interface ColorsProps {
  colors: Colors[];
}

const Colors = ({ colors }: ColorsProps) => {

  return (
    <div className="max-w-[80rem] mx-auto my-[10rem]">
      {colors.map((color, index) => (
        <div key={index} className="!mb-10">
          <h6 className="text-white text-lg mb-5 font-semibold">{color.title}</h6>
          <section className="flex w-full items-center gap-10">
            {
              color.colors.map((color, index) => (
                <Color key={index} value={color.value} code={color.code} label={color.label}/>
              ))
            }
          </section>
        </div>
      ))}
    </div>
  );
};

export default Colors
