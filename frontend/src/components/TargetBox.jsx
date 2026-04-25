export default function TargetBox({ x, y, characters, onSelect }) {
    const SIZE = 60; // size of the red box in pixels
    const HALF = SIZE / 2;
    
    return (
        <>
            {/* The red targeting square */}
            <div style={{
                position: 'absolute',
                left: x - HALF + 'px',
                top:  y - HALF + 'px',
                width:  SIZE + 'px',
                height: SIZE + 'px',
                border: '3px solid #e74c3c',
                borderRadius: '4px',
                pointerEvents: 'none', // don't capture clicks
            }} />
        
            {/* The dropdown list of characters */}
            <div
                style={{
                position: 'absolute',
                left: x - HALF + 'px',
                top:  y + HALF + 10 + 'px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '140px',
                zIndex: 10,
                }}
                // IMPORTANT: stop click from reaching the game-area div
                // otherwise it would immediately close this box
                onClick={e => e.stopPropagation()}
            >
                {characters.map(c => (
                <div
                    key={c.id}
                    onClick={() => onSelect(c)}
                    style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    color: '#222',
                    }}
                    onMouseEnter={e => e.target.style.background = '#f0f4ff'}
                    onMouseLeave={e => e.target.style.background = 'white'}
                >
                    {c.name}
                </div>
                ))}
            </div>
        </>
    );
}