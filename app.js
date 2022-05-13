const scrapedin = require('./src/scrapedin')
const start = async () =>{
    try{
        const profileScraper = await scrapedin({email:'youremail@gmail.com',password:'yourpassword',},)
        const company = await profileScraper('https://www.linkedin.com/company/world-health-organization');
        const companyProfile = await company.profile();
        const posts = await company.post.getPosts({untilPostId: '6923560299572695040'});
        console.log('company profile: ', companyProfile);
        console.log('company posts ', posts);
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