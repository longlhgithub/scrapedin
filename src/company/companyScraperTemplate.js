const template = {
  profile: {
    selector: '.org-top-card',
    fields: {
      name: `h1`,
      headline: `p`,
      imageurl: {
        selector: `img.org-top-card-primary-content__logo`,
        attribute: 'src',
      },
    },
  },
  about: {
    selector: '.org-grid__core-rail--no-margin-left',
    fields: {
      overview: 'p',
      types: {
        selector: 'dl dt',
        isMultipleFields: true,
      },
      values: {
        selector: 'dl dd:not(.org-page-details__employees-on-linkedin-count)',
        isMultipleFields: true,
      },
    },
  },
  posts: {
    selector: '.feeds .feed-item',
    fields: {
      link: {          
        attribute: 'data-comment-page-path',
      },
      id: {
          attribute: 'data-id',
      },
      text: 'p',
      images: {
        selector: '.post-content-wrapper img',
        attribute: 'src',
        isMultipleFields: true
      },
      publishedTime: '.entity-extra-details time',
      likes: '.reactions-count',
      commentCount: {
          selector: '.comment-count-up',
          attribute: 'data-current-count'
      }
    },
  },
}

module.exports = template
