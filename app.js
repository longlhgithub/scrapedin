const scrapedin = require('./src/scrapedin')
const cookies = require('./cookies.json')
const start = async () =>{
    try{
        const profileScraper = await scrapedin({cookies, isHeadless: true, },)
        const company = await profileScraper('https://www.linkedin.com/company/world-health-organization');
        const posts = await company.post.getPosts({untilPostId: '6923560299572695040'});
       
        console.log(posts);
    }
    catch(ex){
        console.log('error', ex);
    }
    
};

(async () => {
    try {
        await start();
        
    } catch (e) {
        // Deal with the fact the chain failed
    }
    // `text` is not available here
})()