import ActiveVote from '@/src/components/Vote/ActiveVote'
import InactiveVote from '@/src/components/Vote/InactiveVote'

interface MergeProps {
  activeVote?: boolean
  handlerChange?: ()=> void
}

const Merge = ({ activeVote, handlerChange }: MergeProps) => {
  return <div>{activeVote ? <ActiveVote handlerChange={handlerChange} /> : <InactiveVote handlerChange={handlerChange}  />}</div>
}

export default Merge
