var yellow = '#edd814';

export default {
  settings: {
    fill: '#fff',
    stroke: {
      color: '#000',
      width: 4,
      linecap: 'round',
      linejoin: 'round',
      miterlimit: 10
    }
  },
  list: {
    logo: {
      paths: [
        {
          d:
            'M11 23v23m9-36v14M30 2v65m9-57v12m10-6v37m18-22v8M2 31v8m57 0v7m0-23v8M30.047 19L2 35l28 17 37-17z',
          stroke: 'default',
          fill: '#fff'
        },
        {
          d: 'M39 49v11M20 47v13',
          stroke: 'default',
          fill: 'default'
        }
      ],
      circles: [
        { cx: 21, cy: 35, r: 5, fill: yellow, stroke: { width: 2 } },
        {
          cx: 39,
          cy: 35,
          r: 6,
          fill: '#000',
          stroke: { width: 2, color: yellow }
        }
      ],
      width: 69,
      height: 69
    },
    chevronLeft: {
      paths: [
        {
          d:
            'M18.904 41.094L2.465 24.653c-1.953-1.953-1.953-5.119 0-7.071L19.047 1l7.071 7.071-13.047 13.047 12.904 12.905-7.071 7.071z',
          fill: '#fff',
          stroke: { width: 3 }
        }
      ],
      width: 28,
      height: 43
    },
    chevronRight: {
      paths: [
        {
          d:
            'M8.214 41.094l16.439-16.44c1.953-1.953 1.953-5.119 0-7.071L8.071 1 1 8.071l13.047 13.046L1.143 34.022l7.071 7.072z',
          fill: '#fff',
          stroke: { width: 3 }
        }
      ],
      width: 28,
      height: 43
    },
    keyboardNav: {
      paths: [
        {
          d:
            'M11.5 9.5c0 1.105-.895 2-2 2h-7c-1.105 0-2-.895-2-2v-7c0-1.105.895-2 2-2h7c1.105 0 2 .895 2 2v7z',
          fill: 'default',
          stroke: { width: 1 }
        },
        {
          d: 'M5.561 9.1L3.487 7.025 5.612 4.9',
          fill: 'default',
          stroke: { width: 1 }
        },
        {
          d:
            'M24.5 2.5c0-1.105-.895-2-2-2h-7c-1.105 0-2 .895-2 2v7c0 1.105.895 2 2 2h7c1.105 0 2-.895 2-2v-7z',
          fill: 'default',
          stroke: { width: 1 }
        },
        {
          d: 'M19.439 9.1l2.074-2.075L19.388 4.9',
          fill: 'default',
          stroke: { width: 1 }
        }
      ],
      width: 25,
      height: 12
    },
    mouseWheel: {
      paths: [
        {
          d:
            'M7.184 11.597c0 1.846-1.496 3.342-3.342 3.342S.5 13.443.5 11.597V8.032C.5 6.186 1.996 4.69 3.842 4.69s3.342 1.496 3.342 3.342v3.565z',
          fill: 'default',
          stroke: { width: 1 }
        },
        {
          d:
            'M3.842 7.816v1.998m-2.1-7.033L3.817.707l2.125 2.125m0 14.583L3.867 19.49l-2.125-2.125',
          fill: 'default',
          stroke: { width: 1 }
        }
      ],
      width: 8,
      height: 21
    },
    desktop: {
      paths: [
        {
          d: 'M1 1h49v32H1z',
          stroke: { width: 2 },
          fill: '#fff'
        },
        {
          d: 'M1 10h49v23H1z',
          stroke: { width: 2 },
          fill: '#fff',
          class: 'hovered-svg-element'
        }
      ],
      circles: [
        {
          cx: 6,
          cy: 5.5,
          r: 2,
          fill: '#000'
        },
        {
          cx: 11,
          cy: 5.5,
          r: 2,
          fill: '#000'
        },
        {
          cx: 16,
          cy: 5.5,
          r: 2,
          fill: '#000'
        }
      ],
      width: 51,
      height: 34
    },
    mobile: {
      paths: [
        {
          d:
            'M20 31c0 1.105-.895 2-2 2H3c-1.105 0-2-.895-2-2V3c0-1.105.895-2 2-2h15c1.105 0 2 .895 2 2v28z',
          stroke: { width: 2 },
          fill: '#fff'
        },
        {
          d:
            'M17 23c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1V7c0-.552.448-1 1-1h11c.552 0 1 .448 1 1v16z',
          stroke: { width: 2 },
          fill: '#fff',
          class: 'hovered-svg-element'
        }
      ],
      circles: [
        {
          cx: 10.5,
          cy: 28.5,
          r: 2,
          fill: '#000'
        }
      ],
      width: 21,
      height: 34
    },
    gallery: {
      paths: [
        {
          d: 'M11 1h27v18H11z',
          stroke: { width: 2 },
          fill: '#fff'
        },
        {
          d: 'M6 6h27v18H6z',
          stroke: { width: 2 },
          fill: '#fff'
        },
        {
          d: 'M1 11h27v18H1z',
          stroke: { width: 2 },
          fill: '#fff',
          class: 'hovered-svg-element'
        },
        {
          d: 'M6 19h16v2H6zm0 4h13v2H6z',
          fill: '#000'
        }
      ],
      circles: [{ cx: 7, cy: 16, r: 1.5 }],
      width: 40,
      height: 30
    },
    info: {
      paths: [
        {
          d:
            'M25 31c0 1.105-.895 2-2 2H3c-1.105 0-2-.895-2-2V3c0-1.105.895-2 2-2h20c1.105 0 2 .895 2 2v28z',
          stroke: { width: 2 },
          fill: '#fff',
          class: 'hovered-svg-element'
        },
        {
          d:
            'M17 27c0 1.105-.895 2-2 2h-4c-1.105 0-2-.895-2-2v-9c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v9z',
          stroke: { width: 2 },
          fill: '#fff'
        }
      ],
      circles: [
        {
          cx: 13,
          cy: 9,
          r: 4,
          stroke: { width: 2 },
          fill: '#fff'
        }
      ],
      width: 26,
      height: 34
    },
    pin: {
      paths: [
        {
          d:
            'M11.99 1.5c-.021 0-.042.001-.063.002 0 0-.024-.002-.045-.002C6.144 1.5 1.5 6.151 1.5 11.889c0 2.963.781 5.178 3.24 7.649s7.111 4.612 7.111 12.612h.18c0-8 4.657-10.126 7.115-12.597s3.233-4.632 3.233-7.595C22.378 6.219 17.727 1.5 11.99 1.5z',
          fill: 'default',
          stroke: 'default'
        }
      ],
      width: 24,
      height: 34
    },
    pin2: {
      paths: [
        {
          d:
            'M20.5 14.5c0 3.314-2.686 6-6 6h-7c-3.314 0-6-2.686-6-6v-7c0-3.314 2.686-6 6-6h7c3.314 0 6 2.686 6 6v7z'
        }
      ],
      width: 22,
      height: 22
    },
    pin3: {
      circles: [
        {
          cx: 7.5,
          cy: 7.5,
          r: 7.5
        }
      ],
      width: 15,
      height: 15
    },
    x: {
      paths: [
        {
          d:
            'M36.152 8.69L28.463 1l-9.887 9.887L8.69 1 1 8.69l9.887 9.886L1 28.463l7.69 7.689 9.886-9.886 9.887 9.886 7.689-7.689-9.886-9.887z',
          stroke: {
            width: 3
          },
          fill: 'default'
        }
      ],
      width: 37,
      height: 37
    }
  }
};
