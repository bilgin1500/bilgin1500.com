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
    ],
    copyright: '&copy;{year} Bilgin Özkan'
  },
  settings: {
    isLoggerActive: false,
    isPerformanceActive: false,
    idCounter: 0,
    separatorMain: '—',
    separatorProject: '‹',
    projectWindowId: 'project-window'
  },
  pages: [
    {
      name: 'Intro',
      content:
        'Hi there! I&apos;m Bilgin Özkan, a creative soul with a main focus on web design and development. Over the years I had the great opportunity to work for some of the best brands and products in Turkey such as Türkiye İş Bankası, Nike, Ikea, Babylon, Pozitif, Hürriyet and Enka Kültür Sanat. Currently I am partner and Digital Design Lead at <a href="#">Rolakosta</a>, a boutique design studio with a multidisciplinary approach specialized in branding, cultural projects and new media content.'
    },
    {
      name: 'Projects',
      list: [
        {
          name: 'Skytanking Ovenon Website',
          desc: 'Website design and development for Skytanking Ovenon',
          meta: {
            category: 'Commercial Work',
            tags: ['Wordpress Integration', 'Responsive'],
            links: [{ Website: 'http://skytankingovenon.com' }],
            date: '2017'
          },
          theme: {
            size: 'large',
            momentum: { speed: 0.4 },
            colors: {
              light: '#b9bcc5',
              spot1: '#010a61',
              spot2: '#f02c2e'
            },
            thumbnail: {
              image: 'skytankingovenon-thumb.png',
              fontColor: 'light'
            }
          },
          sections: [
            {
              name: 'About',
              type: 'info',
              content: [
                {
                  title: 'Problem',
                  text:
                    "After acquired by Hamburg based Skytanking Group, the Turkish Aviation Fuelling Company Ovenon, with its new name Skytanking Ovenon hired Rolakosta to design and develop their new corporate website. Our main goal was to merge the needs of Ovenon brand with their new global partner's vision and brand identity."
                },
                {
                  title: 'Design',
                  text:
                    "After careful examination of the Skytanking website and detailed briefing process by Ovenon's lead team the design process began with the initial wireframing. After completed the architecture and the overall layout we iterated through the visual design with a modular approach where we've built variety of design choices for every module available on the page. The design process was finished in the browser by implementing the interaction layer including the animations and responsive layout."
                },
                {
                  title: 'Results',
                  text:
                    'The light and modern design of the website gained very positive feedback from the users and the companies involved in the process. Thanks to the user-friendly Wordpress panel we have integrated the website is getting more content updates than before which makes it more alive than its counterparts.'
                }
              ]
            },
            {
              name: 'Gallery',
              type: 'gallery',
              content: [
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
            },
            {
              name: 'Desktop',
              type: 'video',
              source: 'https://player.vimeo.com/video/252621827',
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
            }
          ]
        },
        {
          name: 'Rolio',
          desc: 'A minimal Wordpress theme for the creative individual ',
          meta: {
            category: 'Personal Project',
            tags: ['Wordpress Theme Development'],
            links: [{ GitHub: 'https://github.com/bilgin1500/rolio' }],
            date: '2016 - 2017'
          },
          theme: {
            size: 'large',
            momentum: { speed: 0.2 },
            colors: {
              light: '#ccc',
              spot1: '#ddd',
              spot2: '#000'
            },
            thumbnail: {
              image: 'rolio.png',
              fontColor: 'dark'
            }
          },
          sections: [
            {
              name: 'Gallery',
              type: 'gallery',
              content: [
                {
                  source: '1.jpg',
                  caption: 'Here I try to accomplish the best design learnings',
                  alt: 'What an alternative text',
                  width: 300,
                  height: 100
                },
                { source: '2.png' }
              ]
            },
            {
              name: 'About',
              type: 'info',
              content: [
                {
                  title: 'Problem',
                  text:
                    'At [Rolakosta][1] we had a customer segment consisting of individual artists, makers, writers and designers with a common need for a simple, ease to maintain and yet elegant website. After working with many of these troubled souls we found ourselves repeating the same design process in every project and decided to find a better and easy way to serve their common problem.'
                },
                {
                  title: 'Design',
                  text:
                    "Altough these people are not familiar with any of the content management tools available in the market they have explicit opinions about their data, how to structure and showcase it. The content management tool we're going to provide them should be easy to learn and flexible to fit these individuals different needs. We decided to build a basic Wordpress theme using the Customize API where we can give them the opportunity to manage their own data and have the ability to change the look of their site in a easy and not that time consuming way. After sketching and designing the guide screens on Sketch the process mostly went in the browser. I was responsible for both the front-end design and development and Wordpress theme development."
                },
                {
                  title: 'Results',
                  text:
                    'Rolio is used for many of our customers ([burakozkan.info](http://www.burakozkan.info), [artwalkistanbul.com](http://www.artwalkistanbul.com), [utkudervent.com](http://www.utkudervent.com)) at [Rolakosta][1]. Rolio&apos;s vision in the near future is to make its way to Wordpress Theme Directory and gain some recognition and feedback on [GitHub][2]'
                }
              ]
            }
          ]
        },
        {
          name: 'Şirin Pancaroğlu Website',
          desc: 'Personal Website of Turkish Harpist Şirin Pancaroğlu',
          meta: {
            category: 'Commercial Work',
            tags: ['Wordpress Integration', 'Responsive'],
            links: [{ Website: 'http://sirinpancaroglu.com' }],
            date: '2017'
          },
          theme: {
            size: 'large',
            momentum: { speed: 0.2 },
            colors: {
              light: '#ccc',
              spot1: '#ddd',
              spot2: '#000'
            },
            thumbnail: {
              image: 'sp-f3.png',
              fontColor: 'dark'
            }
          },
          sections: []
        }
      ]
    },
    {
      name: 'About me'
    },
    {
      name: 'Sketchbook'
    }
  ]
};
