import React, { useState, useRef, useEffect } from 'react'

interface FaqItemProps {
  faq: {
    title: string;
    description: string;
  };
}

const FaqItem = ({ faq: { title, description } } : FaqItemProps ) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && contentEl.current) {
      contentEl.current.style.height = `${contentEl.current.scrollHeight}px`
    } else if (contentEl.current) {
      contentEl.current.style.height = "0px"
    }
  }, [isOpen])

  const handlerOpen = () => setIsOpen(!isOpen)

  return (
    <div>
      <div
        className={`text-chilean-fire-600 cursor-pointer font-semibold text-sm border border-shark-950 rounded-[10px] flex items-center w-[100%] px-10 py-5 justify-between transition-colors bg-shark-400 bg-opacity-40 ${isOpen && 'text-white'}`}
        onClick={handlerOpen}
      >
        {title}
        <div className={`icon-chevron text-chilean-fire-600 transition ${isOpen && 'text-white rotate-180'}`}></div>
      </div>
      <div ref={contentEl} className={`overflow-hidden h-0 transition-height`}>
        <div className="text-white text-sm bg-shark-400 bg-opacity-40 my-2 py-10 px-10 rounded-sm">
          {description}
        </div>
      </div>
    </div>
  )
}


export default FaqItem
