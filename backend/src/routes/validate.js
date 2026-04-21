const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/validate
router.post('/', async (req, res) => {
    const { sessionId, characterId, x, y } = req.body;

    // load the session to see what's already been found
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
    });

    // load the character - this is where we finally read the secret bounding box coordinates
    const character = await prisma.character.findUnique({
        where: { id: characterId },
    });

    // already found this one?
    if (session.found.includes(character.name)) {
        return res.json({ correct: false, message: 'Already found!' });
    }

    // is the click inside the bounding box?
    const hit = 
        x >= character.xMin && x <= character.xMax &&
        y >= character.yMin && y <= character.yMax;

    if (!hit) {
        return res.json({ correct: false, message: 'Not quite! Try again.' });
    }

    // mark this character as found in the session
    await prisma.session.update({
        where: { id: sessionId },
        data: { found: { push: character.name }},
    });

    // return the center of the box so the frontend know exactly where to draw the green circle
    res.json({
        correct:            true,
        message:            `You found ${character.name}!`,
        markerX:            (character.xMin + character.xMax) / 2,
        markerY:            (character.yMin + character.yMax) / 2,
        characterName:      character.name,
    });
});

module.exports = router;