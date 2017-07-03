
export const defaultConfiguration = {
    titleClosed: 'Click to chat!',
    titleOpen: 'Let\'s chat!',
    closedStyle: 'chat', // button or chat
    closedChatAvatarUrl: '', // only used if closedStyle is set to 'chat'
    cookieExpiration: 1, // in days. Once opened, closed chat title will be shown as button (when closedStyle is set to 'chat')
    introMessage: 'Hello! How can we help you?',
    autoResponse: 'Looking for the first available admin (It might take a minute)',
    autoNoResponse: 'It seems that no one is available to answer right now. Please tell us how we can ' +
    'contact you, and we will get back to you as soon as we can.',
    placeholderText: 'Send a message...',
    displayMessageTime: true,
    mainColor: '#1f8ceb',
    alwaysUseFloatingButton: false,
    desktopHeight: 450,
    desktopWidth: 370
};
