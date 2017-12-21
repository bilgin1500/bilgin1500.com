module.exports = {
  title: 'bilgin1500',
  subtitle: '👋 Hi!',
  description:
    'b1500 is Bilgin Özkan,visual designer & front-end developer from Istanbul',
  settings: {
    isLoggerActive: false,
    idCounter: 0,
    titleSep: '|'
  },
  pages: [
    {
      slug: 'intro',
      name: 'Intro',
      basics:
        'b1500 is Bilgin Özkan,visual designer & front-end developer from Istanbul',
      more: [
        'who loves to get inspired by great architecture.',
        'who has a focus on web design',
        'think off the grid.',
        'decode guidelines.',
        'code',
        'play role playing games',
        'play board games',
        'read comics',
        'get inspired by great architecture',
        'enjoy good storytelling'
      ]
    },
    {
      slug: 'projects',
      name: 'Projects',
      list: [
        {
          slug: 'skytankingovenon',
          name: 'SkytankingOvenon.com',
          desc: 'Fueling the rockets',
          size: 'small',
          thumbnail: 'thumbnail.svg',
          sections: [
            {
              desktop: {
                type: 'video',
                poster: 'video-poster.png',
                sources: [{ mp4: 'video.mp4' }, { webm: 'video.webm' }]
              }
            },
            {
              mobile: {
                type: 'video',
                poster: 'video-poster.png',
                sources: [{ mp4: 'video.mp4' }, { webm: 'video.webm' }]
              }
            },
            {
              gallery: {
                type: 'gallery',
                sources: ['1.jpg', '2.jpg']
              }
            },
            { info: '' }
          ]
        },
        {
          slug: 'rolio',
          name: 'Rolio',
          desc: 'A Theme for The Minimalist',
          size: 'large',
          thumbnail: 'thumbnail.svg',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        },
        {
          slug: 'test',
          name: 'Test.com',
          desc: 'Something wicked',
          size: 'medium',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        },
        {
          slug: 'yesyes',
          name: 'Yesyes',
          desc: 'This is a placeholder',
          size: 'medium',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        },
        {
          slug: 'this-is-it',
          name: 'Thisisit.com',
          desc: 'Fueling the rockets',
          size: 'small',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        },
        {
          slug: 'yep-it-is',
          name: 'Rolio',
          desc: 'A Theme for The Minimalist',
          size: 'large',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        },
        {
          slug: 'what-a-day',
          name: 'Test.com',
          desc: 'Something wicked',
          size: 'medium',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        },
        {
          slug: 'ultimate-project',
          name: 'Yesyes',
          desc: 'This is a placeholder',
          size: 'medium',
          sections: [
            { desktop: '' },
            { mobile: '' },
            { gallery: '' },
            { info: '' }
          ]
        }
      ]
    },
    {
      slug: 'about',
      name: 'About'
    },
    {
      slug: 'sketchbook',
      name: 'Sketchbook'
    }
  ]
};
