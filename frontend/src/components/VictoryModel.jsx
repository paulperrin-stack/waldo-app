import { useState, useEffect } from 'react';
import axios from 'axios';
 
const API = import.meta.env.VITE_API_URL;
 
// Convert milliseconds to a readable string like '1m 34s' or '45s'
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}
    
export default function VictoryModal({ timeMs, imageId, onClose }) {
    const [name,    setName]    = useState('');
    const [saved,   setSaved]   = useState(false);
    const [scores,  setScores]  = useState([]);
    
    // Load the leaderboard when the modal opens
    useEffect(() => {
        axios.get(`${API}/api/leaderboard?imageId=${imageId}`)
            .then(r => setScores(r.data));
    }, [imageId]);
    
    const handleSave = async () => {
        if (!name.trim()) return;
        await axios.post(`${API}/api/leaderboard`, { playerName: name, imageId, timeMs });
        setSaved(true);
        // Reload the leaderboard to show the new score
        const r = await axios.get(`${API}/api/leaderboard?imageId=${imageId}`);
        setScores(r.data);
    };
    
    return (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ background:'#16213e', borderRadius:'16px', padding:'2rem',
                            width:'min(440px, 90vw)', textAlign:'center', color:'white' }}>
                <h2 style={{ color:'#f39c12', marginBottom:'0.5rem' }}>You found everyone! 🎉</h2>
                <p style={{ fontSize:'1.3rem', marginBottom:'1.5rem' }}>
                Your time: <strong>{formatTime(timeMs)}</strong>
                </p>
    
                {!saved ? (
                    <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem' }}>
                        <input
                            placeholder='Enter your name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ flex:1, padding:'0.5rem', borderRadius:'6px', border:'none' }}
                        />
                        <button
                            onClick={handleSave}
                            style={{ padding:'0.5rem 1rem', background:'#e74c3c', color:'white',
                                border:'none', borderRadius:'6px', cursor:'pointer' }}
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <p style={{ color:'#27ae60', marginBottom:'1rem' }}>Saved!</p>
                )}
    
                <h3 style={{ color:'#aaa', marginBottom:'0.5rem' }}>Top 10</h3>
                {scores.map((s, i) => (
                    <div key={s.id} style={{ display:'flex', justifyContent:'space-between',
                            padding:'0.3rem 0', borderBottom:'1px solid #2c3e50' }}>
                        <span>{i + 1}. {s.playerName}</span>
                        <span style={{ color:'#f39c12' }}>{formatTime(s.timeMs)}</span>
                    </div>
                ))}
        
                <button
                    onClick={onClose}
                    style={{ marginTop:'1.5rem', padding:'0.6rem 1.5rem', background:'#e74c3c',
                            color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }}
                    >
                    Play Again
                </button>
            </div>
        </div>
    );
}