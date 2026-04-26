const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/leaderboard?imageId=xxx - fetch top 10 scores
router.get('/', async (req, res) => {
    const scores = await prisma.score.findMany({
        where: { imageId: req.query.imageId },
        orderBy: { timeMs: 'asc' }, // fastest first
        take: 10,
    });
    res.json(scores);
});

// POST /api/leaderboard - save a score
router.post('/', async (req, res) => {
    const { playerName, imageId, timeMs } = req.body;
    const score = await prisma.score.create({
        data: { playerName, imageId, timeMs },
    });
    res.json(score);
});

module.exports = router;