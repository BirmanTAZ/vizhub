const base = {
  headerHeight: 32,
  infoAvatarHeight: 64,
  commentAvatarHeight: 32
};

export const light = Object.assign({}, base, {
  foreground: 'black',
  background: 'white'
});

export const dark = Object.assign({}, base, {
  foreground: 'white',
  background: 'black'
});