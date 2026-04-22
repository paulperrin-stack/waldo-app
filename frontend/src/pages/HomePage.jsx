import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function HomePage() {
    const [images, setImage] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API}/api/images`)
            .then(response => setImage(response.data))
            .catch(err => console.error('Could not load image:', err))
            .finally(() => setLoading(false));
    }, []); // empty [] means: run once when the component first appears
    
    if (loading) return <p>Loading...</p>;

    return (
        <div className='home'>
            <h1>Where's Waldo?</h1>
            <p>Click a level to start playing</p>

            <div className='level-grid'>
                {images.map(img => (
                    <div key={img.id} className='level-card' onClick={() => navigate(`/game/${img.slug}`)}> 
                        <img src={img.imageUrl} alt={img.title} />
                        <h3>{img.title}</h3>
                        <p>Find: {img.characters.map(c => c.name).join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}