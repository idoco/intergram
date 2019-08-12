
export const desktopWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1,
    borderRadius: '10px',
    background: 'rgb(229, 229, 229)',
    boxSizing: 'content-box',
    boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden'
};

export const desktopClosedWrapperStyleChat = {
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    zIndex: 1,
    minWidth: '400px',
    boxSizing: 'content-box',
    overflow: 'hidden',
    minHeight: '120px'
};

export const mobileClosedWrapperStyle = {
    position: 'fixed',
    bottom: 18,
    right: 18,
    zIndex: 1,
    borderRadius: '50%',
    background: 'rgb(229, 229, 229)',
    boxSizing: 'content-box'
};

export const mobileOpenWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    background: 'rgb(229, 229, 229)',
    overflowY: 'visible',
    boxSizing: 'content-box'
};

export const desktopTitleStyle = {
    height: '40px',
    lineHeight: '30px',
    fontSize: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0 5px 20px',
    fontFamily: 'Lato, sans-serif',
    color: '#fff',
    cursor: 'pointer',
};

export const mobileTitleStyle = {
    height: 52,
    width: 52,
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    webkitBoxShadow: '1px 1px 4px rgba(101,119,134,.75)',
    boxShadow: '1px 1px 4px rgba(101,119,134,.75)'
};

export const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0px 30px 0px 0px'
};
