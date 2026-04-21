const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/images
router.get('/', async (req, res) => {
    const images = await prisma.image.findMany({
        include: {
            characters: {
                select: { id: true, name: true},
            },
        },
    });
    res.json(images);
});

module.exports = router;