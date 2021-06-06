var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/bio-tarik/bio-tarik.github.io.git', // Update to point to your repository  
        user: {
            name: 'bio-tarik', // update to use your name
            email: 'bio.tarik@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)