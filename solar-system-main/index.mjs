import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', { image: null });
});

app.get('/planet/:name', (req, res) => {
    let name = req.params.name;
    let cap = name.charAt(0).toUpperCase() + name.slice(1);
    let planetData = planets[`get${cap}`]();
    res.render('planet', { planet: planetData });
});

app.get('/asteroids', async (req, res) => {
    let data = planets.getAsteroidBelt ? planets.getAsteroidBelt() : null;
    res.render('asteroids', { data });
});

app.get('/comets', async (req, res) => {
    let data = planets.getComets ? planets.getComets() : null;
    res.render('comets', { data });
});

app.get('/nasa-pod', async (req, res) => {
    const apiKey = 'DEMO_KEY';
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = await response.json();
    res.render('nasa-pod', { pod: data });
});

app.listen(3000, () => {
    console.log('server started');
});