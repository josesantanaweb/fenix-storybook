// eslint-disable-next-line react/prop-types, @typescript-eslint/no-explicit-any
export default function Check({ width, height, props  }: { width?: number; height?: number; [x: string]: any }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width || "1em"}
            height={height || "1em"}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <path d="M10 16.4L6 12.4L7.4 11L10 13.6L16.6 7L18 8.4L10 16.4Z" fill="currentColor" />
        </svg>
    )
}
