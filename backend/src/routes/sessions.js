const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/sessions/start
router.post('/start', async (req, res) => {
    const { imageId } = req.body;

    const session = await prisma.session.create({
        data: { imageId, found: [] },
    });

    res.json({ sessionId: session.id });
});

// POST /api/sessions/end
router.post('/end', async (req, res) => {
    const { sessionId } = req.body;

    const session = await prisma.session.findUnique({
        where: { id: sessionId },
    });

    const endTime = new Date();
    const timeMs = endTime - session.startTime; // milliseconds

    await prisma.session.update({
        where: { id: sessionId },
        data: { endTime },
    });

    res.json({ timeMs });
});

module.exports = router;