import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'public')));

const planets = [
    'mercury', 'venus', 'earth', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune'
];

app.get('/', async (req, res) => {
    try {
        const response = await fetch(
            `https://images-api.nasa.gov/search?q=solar+system&media_type=image&page_size=20`
        );
        const data = await response.json();
        const items = data.collection.items;
        const random = items[Math.floor(Math.random() * items.length)];
        const image = {
            largeImageURL: random.links[0].href,
            tags: random.data[0].title,
            user: 'NASA'
        };
        res.render('home', { image });
    } catch (error) {
        res.render('home', { image: null });
    }
});

app.get('/planet/:name', async (req, res) => {
    const planetName = req.params.name.toLowerCase();
    if (planets.includes(planetName)) {
        const planetsModule = (await import('npm-solarsystem')).default;
        const fnName = `get${planetName.charAt(0).toUpperCase() + planetName.slice(1)}`;
        const planetData = planetsModule[fnName]();
        res.render('planet', { planet: planetData });
    } else {
        res.status(404).send('Planet not found');
    }
});

app.get('/asteroids', async (req, res) => {
    try {
        const planetsModule = (await import('npm-solarsystem')).default;
        const data = typeof planetsModule.getAsteroidBelt === 'function'
            ? planetsModule.getAsteroidBelt()
            : typeof planetsModule.getAsteroids === 'function'
                ? planetsModule.getAsteroids()
                : null;
        res.render('asteroids', { data });
    } catch (error) {
        res.render('asteroids', { data: null });
    }
});

app.get('/comets', async (req, res) => {
    try {
        const planetsModule = (await import('npm-solarsystem')).default;
        const data = typeof planetsModule.getComets === 'function'
            ? planetsModule.getComets()
            : typeof planetsModule.getComet === 'function'
                ? planetsModule.getComet()
                : null;
        res.render('comets', { data });
    } catch (error) {
        res.render('comets', { data: null });
    }
});

app.get('/nasa-pod', async (req, res) => {
    try {
        const apiKey = 'DEMO_KEY';
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        const data = await response.json();
        res.render('nasa-pod', { pod: data });
    } catch (error) {
        res.status(500).send('Error fetching NASA POD');
    }
});

app.listen(port, () => {
    console.log(`Solar System app listening at http://localhost:${port}`);
});