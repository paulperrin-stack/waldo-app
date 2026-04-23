import { UseEffect, useState, useCallBack } from 'react';
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

    // Step 3
}