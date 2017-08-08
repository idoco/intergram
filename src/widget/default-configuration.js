export const defaultConfiguration = {
    chatServer: 'https://4bd37c9d.ngrok.io',
    titleClosed: '...',
    titleOpen: 'Ask now',
    closedStyle: 'button', // button or chat
    // closedChatAvatarBackground: 'rgb(255, 255, 255)',
    closedChatAvatarBackground: 'rgb(20, 133, 197) url(media/BAI_Loading_60.gif) no-repeat',
    // closedChatAvatarUrl: 'https://robohash.org/luis.png',
    closedChatAvatarUrl: 'media/luis2.png',
    cookieExpiration: 1, // in days. Once opened, closed chat title will be shown as button (when closedStyle is set to 'chat')
    introMessage: '',//empty value will not any message
    //introMessage: 'Hello! you can ask me anything',
    // autoResponse: 'Looking for the first available admin (It might take a minute)',
    autoResponse: '',//empty value will not any message
    // autoNoResponse: 'It seems that no one is available to answer right now. Please tell us how we can ' +
    // 'contact you, and we will get back to you as soon as we can.',
    autoNoResponse: '',//empty value will not any message
    playSound:true,
    placeholderText: 'Send a message...',
    displayMessageTime: true,
    mainColor: '#1485c5',
    alwaysUseFloatingButton: false,
    desktopHeight: 450,
    desktopWidth: 370,
    aboutLink: 'http://cdn.rawgit.com/bloogram/half-intergram/master/dist/demo.html',
    aboutText: 'About',
    //aboutText: 'AboutIcon',
    chatId: 'bla',
};
