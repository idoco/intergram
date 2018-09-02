
export const defaultConfiguration = {
  alwaysUseFloatingButton: false,
  desktopHeight: 450,
  desktopWidth: 370,
  closedStyle: 'chat', // button or chat
  closedChatAvatarUrl: '', // only used if closedStyle is set to 'chat'
  cookieExpiration: 1, // in days. Once opened, closed chat title will be shown as button (when closedStyle is set to 'chat')
  displayMessageTime: true,
  mainColor: '#1f8ceb',

  titleClosed: 'Click to chat!',
  titleOpen: 'Let\'s chat!',
  introMessage: 'Hello! How can we help you?',
  autoResponse: 'Looking for the first available operator (It might take a minute)',
  autoNoResponse: 'It seems that no one is available to answer right now. Please leave us a message and describe how and when we can contact you.',
  placeholderText: 'Enter message...',
}

export const defaultConfigurationDE = {
  titleClosed: 'Chat starten!',
  titleOpen: 'Der Chat ist aktiv.',
  introMessage: 'Guten Tag! Wie können wir Ihnen helfen?',
  autoResponse: 'Suche nach dem nächsten freien Mitarbeiter...',
  autoNoResponse: 'Derzeit scheint kein Mitarbeiter zur Verfügung zu stehen. Bitte hinterlassen Sie uns eine Nachricht ' +
    'und beschreiben Sie, wann und wie wir Sie kontaktieren können.',
  placeholderText: 'Nachricht eingeben...',
}
