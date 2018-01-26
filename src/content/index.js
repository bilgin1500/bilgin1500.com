module.exports = {
  title: 'bilgin1500',
  subtitle: '👋 Hi!',
  description:
    'b1500 is Bilgin Özkan,visual designer & front-end developer from Istanbul',
  settings: {
    isLoggerActive: false,
    isPerformanceActive: false,
    idCounter: 0,
    titleSep: '‹ — :'
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
          url: 'http://skytankingovenon.com',
          size: 'small',
          thumbnail: 'thumbnail.svg',
          momentum: { speed: 0.4 },
          shapes: [
            {
              type: 'rect',
              attributes: {
                x: '0',
                y: '0',
                width: '7',
                height: '80',
                fill: '#e81355'
              }
            },
            {
              type: 'rect',
              attributes: {
                x: '0',
                y: '0',
                width: '30',
                height: '90',
                fill: '#2121aa'
              }
            }
          ],
          sections: [
            {
              name: 'Desktop',
              slug: 'desktop',
              icon: 'desktop',
              type: 'video',
              frame: 'browser',
              content: {
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
              type: 'video',
              frame: 'phone',
              content: {
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
              type: 'gallery',
              content: {
                sources: [
                  {
                    source: 'skytankingovenon_brief.png',
                    caption: '',
                    alt: 'Briefing',
                    shadow: false
                  },
                  {
                    source: 'skytankingovenon_wireframe_1.png',
                    caption:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis ligula nec diam eleifend laoreet luctus id neque. Sed id metus id lacus molestie sagittis nec sit amet odio. Sed cursus eros pretium mauris posuere aliquam.',
                    alt: 'Wireframe 1'
                  },
                  {
                    source: 'skytankingovenon_wireframe_2.png',
                    caption:
                      'Nec diam eleifend laoreet luctus id neque. Sed id metus id lacus molestie sagittis nec sit amet odio. Sed cursus eros pretium mauris posuere aliquam.',
                    alt: 'Wireframe 2'
                  },
                  {
                    source: 'skytankingovenon_design_1.png',
                    caption: '',
                    alt: 'Design Draft 1'
                  },
                  {
                    source: 'skytankingovenon_design_2.jpg',
                    caption: '',
                    alt: 'Design Draft 2'
                  },
                  {
                    source: 'skytankingovenon_home.png',
                    caption: '',
                    alt: 'Final Design of the Home Page'
                  },
                  {
                    source: 'skytankingovenon_list.png',
                    caption: '',
                    alt: 'Final Design of Listing Pages'
                  },
                  {
                    source: 'skytankingovenon_single.png',
                    caption: '',
                    alt: 'Final Design of a Single Page'
                  },
                  {
                    source: 'skytankingovenon_single_extended.png',
                    caption: '',
                    alt: 'Final Design of a Single Extended Page'
                  }
                ]
              }
            },
            {
              name: 'About',
              slug: 'about',
              icon: 'info',
              type: 'info',
              content: {}
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
          sections: [
            {
              name: 'Desktop',
              slug: 'desktop',
              icon: 'desktop',
              type: 'video',
              content: {
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
              type: 'video',
              content: {
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
              type: 'gallery',
              content: {
                sources: [
                  {
                    source: '1.jpg',
                    caption:
                      'Here I try to accomplish the best design learnings',
                    alt: 'What an alternative text',
                    width: 300,
                    height: 100
                  },
                  { source: '2.png' }
                ]
              }
            },
            {
              name: 'About',
              slug: 'about',
              icon: 'info',
              type: 'info',
              content: {}
            }
          ]
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
