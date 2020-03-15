var ghpages = require('gh-pages');

ghpages.publish(
    '__sapper__/export',
    {
        branch: 'master',
        repo: 'https://github.com/bio-tarik/bio-tarik.github.io.git',
        user: {
            name: 'Tarik Ayoub',
            email: 'bio.tarik@gmail.com'
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!')
    }
)