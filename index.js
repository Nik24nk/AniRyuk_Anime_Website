// server.js
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";



const app = express();
const port = 3000;
// setting up the middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));


// Route for finding Particluar anime title
app.post("/anime", async (req, res) => {
    var i;
    const name = req.body.name;
    const enjoy = [];
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${name}`);
        const result = (response.data);
        for (i = 0; i < result.data.length; i++) {

            const url = result.data[i].url;
            const title = result.data[i].title;
            const image = result.data[i].images.webp.large_image_url;
            enjoy.push({ url, title, image });

        }
        res.render("oneanime.ejs", { enjoy });
    }
    catch (error) {
        console.error(error);
        res.send('Error occurred while fetching data.');
    }
});

// Route for Recommadations of Anime
app.get('/', async (req, res) => {
    const anime = [];
    const theme = [];
    var i, j, k;

    try {
        const response = await axios.get("https://api.jikan.moe/v4/recommendations/anime");
        const result = (response.data);

        // Setting up the themes for Animes
        const themeResponse = await axios.get("https://api.jikan.moe/v4/genres/anime?filter=themes");
        const themeResult = themeResponse.data;

        for (k = 0; k < themeResult.data.length; k++) {

            const themeid = themeResult.data[k].mal_id;
            const themeurl = themeResult.data[k].url;
            const themename = themeResult.data[k].name;
            theme.push({ themeid, themename, themeurl });
        };
        for (i = 0; i < result.data.length; i++) {
            for (j = 0; j < result.data[i].entry.length; j++) {
                const url = result.data[i].entry[j].url;
                const title = result.data[i].entry[j].title;
                const image = result.data[i].entry[j].images.webp.large_image_url;
                anime.push({ url, title, image })
            }
        };
        res.render('index.ejs', { anime, theme });
    }
    catch (error) {
        console.error(error);
        res.send('Error occurred while fetching data.');
    }
});

// Server is listing on port 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
