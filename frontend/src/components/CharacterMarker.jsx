export default function CharacterMarker({ x, y, name }) {
    return (
        <div style={{
            position:  'absolute',
            left:      `${x * 100}%`,
            top:       `${y * 100}%`,
            transform: 'translate(-50%, -50%)', // center on the point
            width:  '40px',
            height: '40px',
            border:       '3px solid #27ae60',
            borderRadius: '50%',
            background:   'rgba(39,174,96,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
        }}>
            ✓
            {/* Label below the circle */}
            <span style={{
                position:   'absolute',
                top:        '110%',
                left:       '50%',
                transform:  'translateX(-50%)',
                background: '#27ae60',
                color:      'white',
                padding:    '2px 6px',
                borderRadius: '4px',
                fontSize:   '11px',
                whiteSpace: 'nowrap',
            }}>
                {name}
            </span>
        </div>
    );
}