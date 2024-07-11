'use client'

interface SearchProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  searchValue: string
  setSearchValue: (value: string) => void
}

const Search = ({ setSearchValue, searchValue, placeholder = 'Search by Name, Symbol or Address..' }: SearchProps) => {
  return (
    <div className="search-box  ">
      <span className="flex items-center justify-center w-8 h-5 text-2xl icon-search text-shark-100" />
      <input
        type="text"
        value={searchValue}
        placeholder={placeholder}
        className="w-full px-2 text-sm bg-transparent outline-none text-shark-100"
        onChange={(event) => setSearchValue(event.target.value)}
      />
    </div>
  )
}

export default Search
