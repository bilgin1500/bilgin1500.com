module.exports = {
  title: 'bilgin1500',
  subtitle: '👋 Hi!',
  description:
    'b1500 is Bilgin Özkan,visual designer & front-end developer from Istanbul',
  settings: {
    isLoggerActive: false,
    isPerformanceActive: false,
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
          momentum: { speed: 0.4 },
          sections: [
            {
              name: 'Desktop',
              slug: 'desktop',
              icon: 'desktop',
              content: {
                type: 'video',
                poster: 'video-poster.png',
                width: 640,
                height: 400,
                sources: [
                  { type: 'mp4', source: 'SampleVideo_720x480_2mb.mp4' },
                  { type: 'webm', source: 'SampleVideo_720x480_2mb.webm' }
                ]
              }
            },
            {
              name: 'Mobile',
              slug: 'mobile',
              icon: 'mobile',
              content: {
                type: 'video',
                poster: 'video-poster.png',
                width: 320,
                height: 240,
                sources: [
                  { type: 'mp4', source: 'video.mp4' },
                  { type: 'webm', source: 'video.webm' }
                ]
              }
            },
            {
              name: 'Gallery',
              slug: 'gallery',
              icon: 'gallery',
              content: {
                type: 'gallery',
                sources: ['1.jpg', '2.jpg']
              }
            },
            {
              name: 'About',
              slug: 'about',
              icon: 'info',
              content: {
                type: 'info'
              }
            }
          ]
        },
        {
          slug: 'rolio',
          name: 'Rolio',
          desc: 'A Theme for The Minimalist',
          size: 'large',
          thumbnail: 'thumbnail.svg',
          momentum: { speed: 0.2 },
          sections: []
        },
        {
          slug: 'test',
          name: 'Test.com',
          desc: 'Something wicked',
          size: 'medium',
          momentum: { speed: 0.4 },
          sections: []
        },
        {
          slug: 'yesyes',
          name: 'Yesyes',
          desc: 'This is a placeholder',
          size: 'medium',
          momentum: { speed: 0.3 },
          sections: []
        },
        {
          slug: 'this-is-it',
          name: 'Thisisit.com',
          desc: 'Fueling the rockets',
          size: 'small',
          momentum: { speed: 0.5 },
          sections: []
        },
        {
          slug: 'yep-it-is',
          name: 'Rolio',
          desc: 'A Theme for The Minimalist',
          size: 'large',
          sections: []
        },
        {
          slug: 'what-a-day',
          name: 'Test.com',
          desc: 'Something wicked',
          size: 'medium',
          sections: []
        },
        {
          slug: 'ultimate-project',
          name: 'Yesyes',
          desc: 'This is a placeholder',
          size: 'medium',
          sections: []
        }
      ]
    },
    {
      slug: 'about',
      name: 'About me'
    },
    {
      slug: 'sketchbook',
      name: 'Sketchbook'
    }
  ]
};
