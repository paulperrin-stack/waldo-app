const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // clear old data first
    await prisma.score.deleteMany();
    await prisma.session.deleteMany();
    await prisma.character.deleteMany();
    await prisma.image.deleteMany();

    // add your game level
    await prisma.image.create({
        data: {
            slug:   'level1',
            title:  'Forest Adventure',
            // this path refers to frontend/public/images/level1.jpg
            // ...
            imageUrl: '/images/level1.jpg',
            character: {
                create: [
                    // replace these with YOUR image's actual coordinates
                    { name: 'Waldo', xMin: 0.67, xMax: 0.73, yMin: 0.33, yMax: 0.39 },
                    { name: 'Wizard', xMin: 0.12, xMax: 0.18, yMin: 0.54, yMax: 0.61 },
                    { name: 'Wilma', xMin: 0.80, xMax: 0.86, yMin: 0.20, yMax: 0.26 },
                ],
            },
        },
    });
    console.log('Done! Database has game data now.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnent());