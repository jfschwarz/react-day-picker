export default {
  padding: '1rem 0',

  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',

  day: {
    padding: '.5rem',
    border: '1px solid #eaecec',
    textAlign: 'center',

    '&today': {
      color: '#d0021b',
    },

    '&disabled': {
      color: '#dce0e0',
      backgroundColor: '#eff1f1',
    },

    '&outside': {
      color: '#dce0e0',
    },
  },

  month: {
    caption: {
      height: '1.5rem',
    },

    weekdays: {
      weekday: {
        padding: '.5rem',
        fontSize: '.875em',
        color: '#8b9898',
      },
      row: {},
    },

    body: {},
  },

  navbar: {
    padding: '0 .5rem',

    button: {
      '&prev': {},
      '&next': {},
    },
  },

  '&interactionDisabled': {

  },
};
