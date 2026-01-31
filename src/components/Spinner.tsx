interface SpinnerProps {
    size?: number;
    color?: string;
    borderWidth?: number;
}

export default function Spinner({ size = 16, color = 'white', borderWidth = 2 }: SpinnerProps) {
    return (
        <>
            <span
                style={{
                    display: 'inline-block',
                    width: `${size}px`,
                    height: `${size}px`,
                    border: `${borderWidth}px solid rgba(255,255,255,0.3)`,
                    borderTopColor: color,
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                }}
            ></span>
            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    );
}
