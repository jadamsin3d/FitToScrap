$(document).ready(() => {

    $('.scrapperbtn').on('click', () => {
        axios.get('https://old.reddit.com/r/ProgrammerHumor/').then(response => {
            const $ = cheerio.load(response.data);

            $('p.title').each((i, element) => {
                const results = {}

                results.title = $(element).text();
                results.link = $(element).children().attr('href');

                db.Article.create(results)
                    .then((dbArticle) => {
                        console.log(dbArticle)
                    })
                    .catch(err =>
                        console.log(err)
                    );
            });
        });
    });


});