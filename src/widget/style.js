export const desktopWrapperStyle = {
  position: 'fixed',
  bottom: '10px',
  right: '20px',
  zIndex: 99999999,
  borderRadius: '8px',
  background: 'white',
  boxSizing: 'content-box',
  width: '74px'
};

export const desktopClosedWrapperStyleChat = {
  position: 'fixed',
  bottom: '10px',
  right: '20px',
  zIndex: 99999999,
  boxSizing: 'content-box'
};

export const mobileClosedWrapperStyle = {
  position: 'fixed',
  bottom: 8,
  right: 8,
  zIndex: 99999999,
  width: '74px',
  boxSizing: 'content-box'
};

export const mobileOpenWrapperStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 2147483647,
  width: '100%',
  height: '100%',
  background: 'rgb(229, 229, 229)',
  overflowY: 'visible',
  boxSizing: 'content-box'
};

export const desktopTitleStyle = {
  height: '34px',
  lineHeight: '34px',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0px 12px 0px 10px',
  alignItems: 'center',
  width: '52px',
  fontFamily: 'Lato, sans-serif',
  color: '#fff',
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '8px'
};

export const mobileTitleStyle = {
  // height: 52,
  // width: 52,
  // cursor: 'pointer',
  // borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
  // webkitBoxShadow: '1px 1px 4px rgba(101,119,134,.75)',
  // boxShadow: '1px 1px 4px rgba(101,119,134,.75)'
};
