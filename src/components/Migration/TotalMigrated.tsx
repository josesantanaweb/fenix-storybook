'use client'

interface TotalMigratedProps {
  state?: string | undefined
}

const TotalMigrated = ({ state }: TotalMigratedProps) => {
  return (
    <div className="relative flex items-center w-full md:h-[62px] px-4 py-2 rounded-lg gap-2 total-migrated-box min-h-[86px] 2xl:w-2/5">
      <div className="justify-center hidden w-10 h-10 p-3 rounded-lg bg-shark-400 bg-opacity-60 xl:flex">
        <span
          className={` text-xl text-transparent bg-gradient-to-r items-center flex justify-center from-outrageous-orange-500 to-festival-500 bg-clip-text icon-compass`}
        />
      </div>
      <div className="w-full">
        <p className="mb-1 text-xs text-shark-100">
          {' '}
          {state === 'success' ? `Total Migrated Amount to FNX` : `Share of veFNX given to non snapshot CHR Migrators`}
        </p>
        {
          <>
            {state === 'success' ? (
              <div className="flex flex-wrap items-center gap-3 md:gap-2 md:flex-nowrap">
                <div className="flex items-center justify-between w-full gap-2 mb-2 md:w-auto md:mb-0 md:justify-start">
                  <h3 className="text-sm text-white">0 CHR</h3>
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
                </div>
                <div className="flex items-center justify-between w-full gap-2 mb-2 md:w-auto md:mb-0 md:justify-start">
                  <h3 className="text-sm text-white">0 veCHR </h3>
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
                </div>
                <div className="flex items-center justify-between w-full gap-2 mb-2 md:w-auto md:mb-0 md:justify-start">
                  <h3 className="text-sm text-white">0 chrNFTs</h3>
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
                </div>
                <div className="flex items-center justify-between w-full gap-2 mb-2 md:w-auto md:mb-0 md:justify-start">
                  <h3 className="text-sm text-white">0 elCHR</h3>
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
                </div>
                <div className="flex items-center justify-between w-full gap-2 mb-2 md:w-auto md:mb-0 md:justify-start">
                  <h3 className="text-sm text-white">0 spCHR</h3>
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full gap-2 mb-2 md:w-auto md:mb-0 md:justify-start">
                <h3 className="text-sm text-white"> $20.108 worth of veFNX</h3>
                <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
              </div>
            )}
          </>
        }
      </div>
    </div>
  )
}

export default TotalMigrated
