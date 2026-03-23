import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
//root route
app.get('/', (req, res) => {
   res.render('home.ejs')
});

app.get('/planetInfo', (req, res) => {
   let planet = req.query.planet;
   let planetInfo = planets[`get${planet}`]();
   res.render('planet.ejs', {planetInfo})
});

// app.get('/mercury', (req, res) => {
//    let mercuryInfo = planets.getMercury();
//    console.log(mercuryInfo);
//    res.render('mercury.ejs', {mercuryInfo})
// });


app.listen(3000, () => {
   console.log('server started');
});
