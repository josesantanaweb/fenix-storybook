import Check from "./Check"

const CheckBox = ({ checked, size = 18, groupHover, className = "", onClick, }: {
    checked?: boolean;
    size?: number;
    groupHover?: boolean;
    className?: string;
    onClick?: () => void;}) => {
    return (
        <div
          style={{ fontSize: size }}
          className={`relative w-[1em] h-[1em] border-[1.5px] rounded-md transition-colors hover:border-navy-blue-950 text-white 
           ${checked ? "bg-orange-600 outline-none p-3 border-orange-600 border" : className }`}
          onClick={onClick}
        >
          {checked && (
            <>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.33em]">
                <Check />
              </span>
            </>
          )}
        </div>
      )
}

export default CheckBox