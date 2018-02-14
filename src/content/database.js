module.exports = {
  info: {
    title: 'bilgin1500.com',
    subtitle: 'Welcome',
    description:
      'Portfolio website of Bilgin Özkan, designer and developer from Istanbul.',
    socialAccounts: [
      ['GitHub', 'https://github.com/bilgin1500/'],
      ['LinkedIn', 'https://www.linkedin.com/in/ozkanbilgin/'],
      ['Twitter', 'https://twitter.com/bilgin1500']
    ]
  },
  settings: {
    isLoggerActive: false,
    isPerformanceActive: false,
    idCounter: 0,
    separatorMain: '—',
    separatorProject: '‹'
  },
  pages: [
    {
      slug: 'intro',
      name: 'Intro',
      content:
        '👋 Hi stranger. My name is Bilgin Özkan. I am a designer and developer with 10 years of experience in the service design with titles such as digital designer, art director and digital creative director. Currently I am the Product Design Manager at <a href="#">Yesthatsright</a>. You can reach me at <a href="#">bilgin1500@gmail.com</a>.<br/>And I guess that\'s it.',
      list: [
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
          category: 'Commercial Works',
          tags: ['Wordpress', 'Responsive'],
          theme: {
            size: 'large',
            color: 'light',
            thumbnail: 'skytankingovenon-thumb.png',
            momentum: { speed: 0.4 }
          },
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
          category: 'Personal Projects',
          tags: ['Wordpress', 'Theme Development'],
          theme: {
            size: 'large',
            color: 'dark',
            thumbnail: 'rolio.png',
            momentum: { speed: 0.2 }
          },
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
          slug: 'sirinpancaroglu',
          name: 'Sirinpancaroglu.com',
          desc: 'Personal Website of Turkish Harpist Şirin Pancaroğlu',
          url: 'http://sirinpancaroglu.com',
          category: 'Commercial Works',
          tags: ['Wordpress', 'Responsive'],
          theme: {
            color: 'dark',
            size: 'large',
            thumbnail: 'sp-f3.png',
            momentum: { speed: 0.4 }
          },
          sections: []
        },
        {
          slug: 'beatsmap',
          name: 'Beatsmap',
          desc: 'Follow the beats, never miss an event',
          category: 'Personal Projects',
          tags: ['Node.js', 'GraphQL', 'Crawler', 'React'],
          theme: {
            color: 'light',
            size: 'large',
            thumbnail: 'beatsmap.png',
            momentum: { speed: 0.4 }
          },
          sections: []
        },
        {
          slug: 'isbank-sermaye-piyasalari',
          name: 'İş Bankası Sermaye Piyasaları',
          desc:
            'Aliquip exea commodo consequat duis aute irure dolor in reprehenderit',
          category: 'Commercial Works',
          tags: ['Web App', 'Cross Browser'],
          theme: {
            color: 'light',
            size: 'large',
            thumbnail: 'isbank.png',
            momentum: { speed: 0.5 }
          },
          sections: []
        },
        {
          slug: 'cappadox',
          name: 'Cappadox',
          desc: 'Suntin culpa qui officia deserunt mollit anim id est laborum',
          category: 'Commercial Works',
          tags: ['Responsive', 'Web App'],
          theme: {
            color: 'light',
            size: 'large',
            thumbnail: 'cappadox.png',
            momentum: { speed: 0.5 }
          },
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
