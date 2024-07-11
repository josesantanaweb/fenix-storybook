/* eslint-disable max-len */

const Spinner = () => {
  return (
    <div role="status">
      <svg width={14} height={14} className="animate-spin" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" >
        <path
          opacity={0.3}
          d="M14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7ZM2.18272 7C2.18272 9.66051 4.33949 11.8173 7 11.8173C9.66051 11.8173 11.8173 9.66051 11.8173 7C11.8173 4.33949 9.66051 2.18272 7 2.18272C4.33949 2.18272 2.18272 4.33949 2.18272 7Z"
          fill="url(#paint0_linear_3593_98943)"
        />
        <path
          d="M12.9086 7C13.5114 7 14.0087 6.50848 13.9151 5.91305C13.8294 5.36786 13.6793 4.83345 13.4672 4.32122C13.1154 3.47194 12.5998 2.70026 11.9497 2.05025C11.2997 1.40024 10.5281 0.884626 9.67878 0.532843C9.16655 0.32067 8.63214 0.170601 8.08695 0.0849049C7.49152 -0.00868836 7 0.488618 7 1.09136C7 1.6941 7.49471 2.17043 8.08205 2.30582C8.34157 2.36564 8.59628 2.44701 8.84349 2.54941C9.42795 2.7915 9.95901 3.14634 10.4063 3.59367C10.8537 4.04099 11.2085 4.57205 11.4506 5.15651C11.553 5.40372 11.6344 5.65843 11.6942 5.91795C11.8296 6.50529 12.3059 7 12.9086 7Z"
          fill="url(#paint1_linear_3593_98943)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3593_98943"
            x1={1.46018}
            y1={8.09375}
            x2={22.2447}
            y2={8.1214}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FE5E35" />
            <stop offset={0.55} stopColor="#F67702" />
            <stop offset={1} stopColor="#FFEF76" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3593_98943"
            x1={1.46018}
            y1={8.09375}
            x2={22.2447}
            y2={8.1214}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FE5E35" />
            <stop offset={0.55} stopColor="#F67702" />
            <stop offset={1} stopColor="#FFEF76" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default Spinner
