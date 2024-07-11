import React from 'react';

interface ColorProps {
  value: string;
  label: string;
  code: string;
}

const Color = ({ value, code, label }: ColorProps) => {
  return (
    <div className="flex flex-col">
      <div className="w-20 h-20 rounded-md" style={{ background: `${value}` }}/>
      <p className="text-white text-sm !mt-2 !mb-0 font-semibold">{code}</p>
      <p className="text-neutral-200 text-sm !my-0">{label}</p>
    </div>
  );
};

export default Color
