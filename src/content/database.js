module.exports = {
  info: {
    title: 'Bilgin Özkan',
    subtitle: 'Designer & Developer',
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
    projectWindowId: 'project-window',
    projectThumbnailRatio: 1.5,
    cloudinary: {
      protocol: 'http://',
      baseUrl: 'res.cloudinary.com/bilginozkan/image/upload/',
      baseFolder: 'projects/',
      baseExtension: 'png'
    }
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
          active: false,
          meta: {
            category: 'Commercial Work',
            tags: ['Wordpress Integration', 'Responsive'],
            links: [{ Website: 'http://skytankingovenon.com' }],
            date: '2017'
          },
          theme: {
            colors: {
              light: '#b9bcc5',
              spot1: '#010a61',
              spot2: '#f02c2e'
            },
            thumbnail: {
              image: 'thumbnail',
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
                  source: 'brief',
                  caption: '',
                  alt: 'Briefing',
                  shadow: false
                },
                {
                  source: 'wireframe1',
                  caption:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis ligula nec diam eleifend laoreet luctus id neque. Sed id metus id lacus molestie sagittis nec sit amet odio. Sed cursus eros pretium mauris posuere aliquam.',
                  alt: 'Wireframe 1'
                },
                {
                  source: 'wireframe2',
                  caption:
                    'Nec diam eleifend laoreet luctus id neque. Sed id metus id lacus molestie sagittis nec sit amet odio. Sed cursus eros pretium mauris posuere aliquam.',
                  alt: 'Wireframe 2'
                },
                {
                  source: 'design1',
                  alt: 'Design Draft 1'
                },
                {
                  source: 'design2',
                  alt: 'Design Draft 2'
                },
                {
                  source: 'home',
                  alt: 'Final Design of the Home Page'
                },
                {
                  source: 'list',
                  alt: 'Final Design of Listing Pages'
                },
                {
                  source: 'single',
                  alt: 'Final Design of a Single Page'
                },
                {
                  source: 'single2',
                  alt: 'Final Design of a Single Extended Page'
                }
              ]
            }
          ]
        },
        {
          name: 'Rolio',
          desc: 'A minimal Wordpress theme for the creative individual',
          active: false,
          meta: {
            category: 'Personal Project',
            tags: ['Wordpress Theme Development'],
            links: [{ GitHub: 'https://github.com/bilgin1500/rolio' }],
            date: '2016 - 2017'
          },
          theme: {
            colors: {
              light: '#fff',
              spot1: '#bfe0d5',
              spot2: '#000'
            },
            thumbnail: {
              image: 'thumbnail',
              fontColor: 'dark'
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
            },
            {
              name: 'Gallery',
              type: 'gallery',
              content: [
                { source: 'after-installation' },
                { source: 'layouts' },
                { source: 'mobile' },
                { source: 'artwalk' },
                { source: 'utkudervent' },
                { source: 'burakozkan' }
              ]
            }
          ]
        },
        {
          name: 'Şirin Pancaroğlu Website',
          desc: 'Personal Website of Turkish Harpist Şirin Pancaroğlu',
          active: false,
          meta: {
            category: 'Commercial Work',
            tags: [
              'Wordpress Integration',
              'Mailchimp Integration',
              'Responsive'
            ],
            links: [{ Website: 'http://sirinpancaroglu.com' }],
            date: '2015 - 2018',
            agency: 'Rolakosta',
            roles: [
              'UX and UI Design',
              'Front-end Development',
              'Wordpress and Mailchimp Integration'
            ]
          },
          theme: {
            colors: {
              light: '#fffaf5',
              spot1: '#56524f',
              spot2: '#dba841'
            },
            thumbnail: {
              image: 'thumbnail',
              fontColor: 'dark'
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
                    'When Şirin Pancaroğlu, the internationally acclaimed Turkish harpist contacted Rolakosta she had a clear vision about what she should expect from us and from the current digital tools: First she wanted to be able to easily document every project she is involved with all the assets like photographs, audio files and texts. Second she wanted to be able to regularly reach her audience through newsletters and social media using only one panel and don&apos;t want to waste much of her valuable time with technical stuff and changing panels or web sites.'
                },
                {
                  title: 'Design',
                  text:
                    'At first we spared some time to build the right information structure. Because of the complexity of our client&apos;s massive data it was a necessary process to be finished on paper before beginning any digital sketching or wireframing. With a minimal visual design and some basic interaction we finished the design process and allocated most of our time to build the best administrative panel experience. After we&apos;ve finalized the information architecture it became obvious that we should get some help from the great Advanced Custom Fields plugin in order to customize the panel according to our client&apos;s needs such as related album information or flag a content to be included in the next newsletter.'
                },
                {
                  title: 'Results',
                  text:
                    'At Rolakosta we always believed that the individual artist should take the control of her digital presence and be able to do the basics of digital marketing without any hustle or pain. In this project we created an interconnected system managed by a single Wordpress panel so that our client can easily organize her projects, manage the newsletters, post to her social media accounts and engage with her audience. Since its release in 2015 the website became a fine example for what an individual artist alone can achieve with its own data, appreciated and mentioned in various programs and articles.'
                }
              ]
            },
            {
              name: 'Gallery',
              type: 'gallery',
              content: [
                { source: 'home' },
                { source: 'biography' },
                { source: 'projects' },
                { source: 'project' },
                { source: 'project2' },
                { source: 'album' },
                { source: 'videos' },
                { source: 'events' },
                { source: 'contact' }
              ]
            }
          ]
        },
        {
          name: 'Cappadox',
          desc: 'Designing a digital festival experience ',
          meta: {
            category: 'Commercial Work',
            tags: ['API Integration', 'Responsive'],
            links: [{ Website: 'http://sirinpancaroglu.com' }],
            agency: 'Rolakosta',
            date: '2015',
            roles: ['UX and UI Design', 'Front-end Development']
          },
          theme: {
            colors: {
              light: '#f6ece3',
              spot1: '#20214e',
              spot2: '#fad936'
            },
            thumbnail: {
              image: 'thumbnail',
              fontColor: 'light'
            }
          },
          sections: [
            {
              name: 'About',
              type: 'info',
              content: [
                {
                  title: 'Background',
                  text:
                    'From 2013 to 2016 at Rolakosta we had the great opportunity to work with <a target="_blank" href="http://www.pozitif.com/">Pozitif</a> in a great variety of digital products from their smallest festival microsites to their biggest flagship websites. In all these projects, we helped them build entertaining and colorful digital products to engage with their young and energetic audience. Me and my team at Rolakosta wireframed, prototyped, designed and developed websites, created motion graphics and gave consultancy services for more than 10 projects for 3 years we worked together.'
                },
                {
                  title: 'Problem',
                  text:
                    'For their new music and arts festival, held in the lunar landscape of Cappadocia in South-East Turkey we collaborated with Pozitif to design and develop festival&apos;s online presence. The main goal was to engage with festival audience in a different user experience reflecting the festival&apos;s mood and style by making the content exploration funny. Secondly we had to make...'
                },
                {
                  title: 'Design',
                  text:
                    'Having received the design assets from <a href="http://foxallstudio.com/">Foxall</a> first we built a microsite to help the marketing team gather some information from early bird customers using questionnaires and email subscriptions which eventually helped them to shape the festival&apos;s program. Due to the short amount of time we worked close with our client and as they progressed with the festival content we simultaneously injected it in the ongoing design process and iterated constantly. The final website is a responsive single page application backed by the festival&apos;s data and authentication APIs and showcasing an experimental UX approach by embracing the drag, scroll and mouse wheel.'
                },
                {
                  title: 'Results',
                  text:
                    'The festival and its website with their unique styles attracked a lot of attention from the audience. In a short amount of time and little marketing effort hundreds of people attended the questionnaires and helped the team to shape the festival. Nearly 90% of the festival&apos;s attenders created a user on the website, booked the events and made their programs. The mobile friendly website also helped the attenders to grab the latest news and announcements during the festival time. '
                }
              ]
            },
            {
              name: 'Gallery',
              type: 'gallery',
              content: [
                { source: 'structure' },
                { source: 'welcome', shadow: true },
                { source: 'events', shadow: true },
                { source: 'events-category', shadow: true },
                { source: 'event-detail', shadow: true },
                { source: 'calendar', shadow: true },
                { source: 'calendar2', shadow: true },
                { source: 'my-calendar', shadow: true },
                { source: 'mobile' }
              ]
            }
          ]
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
