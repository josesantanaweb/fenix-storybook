'use client'

interface ISummary {
  sell: string
  get: string
  receive: string
  frequency: string
}

interface SummaryProps {
  summary: ISummary
}

const Summary = ({ summary }: SummaryProps) => {
  return (
    <div className="exchange-box-x2">
      <h5 className="text-white text-sm mb-2">DCA Summary</h5>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Sell</p>
        <p className="text-white text-sm">{summary.sell}</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Get</p>
        <p className="text-white text-sm">{summary.get}</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Receive</p>
        <p className="text-white text-sm">{summary.receive}</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Frequency</p>
        <p className="text-white text-sm">{summary.frequency}</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Amount per Cicle</p>
        <p className="text-white text-sm">100 USDC</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">End date</p>
        <p className="text-white text-sm">2024/02/10 11:34</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Estimated price impact per cycle</p>
        <p className="text-white text-sm">0.00%</p>
      </li>
      <li className="flex items-center justify-between">
        <p className="text-shark-100 text-sm">Platform Fee</p>
        <p className="text-gradient text-sm">
          0.10%
        </p>
      </li>
    </div>
  )
}

export default Summary
