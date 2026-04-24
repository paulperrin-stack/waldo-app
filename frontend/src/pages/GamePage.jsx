import { UseEffect, useState, useCallBack, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TargetBox from '../components/TargetBox';
import CharacterMarket from '../components/CharacterMarket';
import VictoryModel from '../components/VictoryModel';

const API = import.meta.env.VITE_API_URL;

export default function GamePage() {
    // :slug from the URL (/game/level1 -> slug = 'level1')
    const { slug } = useParams();

    // State = the component's memory
    const [image,       setImage]       = useState(null); // current level data
    const [sessionId,   setSessionId]   = useState(null); // game timer ID
    const [targetBox,   setTargetBox]   = useState(null); // where player clicked
    const [markers,     setMarkers]     = useState([]); // found character circles
    const [found,       setFound]       = useState([]); // names of found chars
    const [feedback,    setFeedback]    = useState(''); // toast message
    const [victory,     setVictory]     = useState(null); // game over data

    // Step 1: when the page loads, get the image data and start a timer
    useEffect(() => {
        async function startGame() {
            // Fetch all images and find the one matching our URL slug
            const { data: images } = await axios.get(`${API}/api/images`);
            const img = images.find(i => i.slug === slug);
            setImage(img);

            // Tell the server to start timing us
            const { data } = await axios.post(`${API}/api/sessions/start`, {
                imageId: img.id,
            });
            setSessionId(data.sessionId);
        }
        startGame().catch(console.error);
    }, [slug]);

    // Step 2: when player clicks the image
    const handleImageClick = useCallBack((e) => {
        // If a target box is already showing, close it
        if (targetBox) {
            setTargetBox(null);
            return;
        }

        // Get the image element's position on screen
        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate where the click was in pixels (relative to the image)
        const pixelX = e.clientX - rect.left;
        const pixelY = e.clientY - rect.top;

        // Convert to 0.0-1.0 by dividing by the image's DISPLAY size
        const normX = pixelX / rect.width;
        const normY = pixelY / rect.height;

        setTargetBox({ pixelX, pixelY, normX, normY });
    }, [targetBox]);

    // Step 3: when player picks a character from the dropdown
    const handleSelect = useCallback(async (character) => {
        const { normX, normY } = targetBox;
        setTargetBox(null); // close the box

        // Ask the server: did we click in the right place?
        const { data } = await axios.post(`${API}/api/validate`, {
            sessionId,
            characterId: character.id,
            x: normX,
            y: normY,
        });

        // Show the result as a toast message
        setFeedback(data.message);
        setTimeout(() => setFeedback(''), 2000);

        if (!data.correct) return; // wrong - do nothing else
        
        // Correct !
        setMarkers(prev => [
            ...prev,
            { name: data.characterName, x: data.markerX, y: data.markerY },
        ]);

        const newFound = [...found, data.characterName];
        setFound(newFound);

        // Did we find everyone?
        if (image && newFound.length === image.charaters.length) {
            const end = await axios.post(`${API}/api/sessions/end`, { sessionId });
            setVictory({ timeMs: end.data.timeMs, imageId: image.id });
        }
    }, [targetBox, found, image, sessionId]);

    // Characters the player has not found yet
    const remaining = image.characters.filter(c => !found.includes(c.name));

    return (
        <div className='game-page'>
            
            {/* Top bar showing which characters to find */}
            <div className='top-bar'>
                <span>Find: </span>
                {image.characters.map(c => (
                    <span
                        key={c.id}
                        style={{ textDecoration: found.includes(c.name) ? 'line-through' : 'name',
                        color: found.includes(c.name) ? '#27ae60' : '#fff' }}
                    >
                        {c.name}
                    </span>
                ))}
            </div>

            {/* Toast notification */}
            {feelback && <div className='toast'>{feelback}</div>}

            {/* The game image with overlays */}
            <div className='game-area' onClick={handleImageClick}>
                <img src={image.imageUrl} alt='game' className='game-img' draggable={false} />

                {targetBox && (
                    <TargetBox
                        x={targetBox.pixelX}
                        y={targetBox.pixelY}
                        characters={remaining}
                        onSelect={handleSelect}
                    />
                )}
                
                {markers.map(m => (
                    <CharacterMarket key={m.name} x={m.x} y={m.y} name={m.name} />
                ))}
            </div>

            {victory && (
                <VictoryModel
                    timeMs={victory.timeMs}
                    imageId={victory.imageId}
                    onClose={() => window.location.href = '/'}
                />
            )}
        </div>
    );
}