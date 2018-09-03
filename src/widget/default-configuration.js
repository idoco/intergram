export const defaultConfiguration = {
  alwaysUseFloatingButton: false,
  desktopHeight: 450,
  desktopWidth: 370,
  closedStyle: 'chat', // button or chat
  closedChatAvatarUrl: '', // only used if closedStyle is set to 'chat'
  cookieExpiration: 1, // in days. Once opened, closed chat title will be shown as button (when closedStyle is set to 'chat')
  displayMessageTime: true,
  mainColor: '#1f8ceb',
  availabilityStart: 0, // Min. Hour of the day (UTC) where widget is shown
  availabilityEnd: 24, // Max. Hour of the day (UTC) where widget is shown
  availability2: false, // Enables second time interval (e.g. to enable 0-3 and 18-24 for other time zones)
  availabilityStart2: 0,
  availabilityEnd2: 0,
  availabilityDays: [0, 1, 2, 3, 4, 5, 6], // 0 = sunday, 6 = saturday

  titleClosed: 'Click to chat!',
  titleOpen: 'Let\'s chat!',
  introMessage: 'Hello! How can we help you?',
  autoResponse: 'Looking for the first available operator (It might take a minute)',
  autoNoResponse: 'It seems that no one is available to answer right now. Please leave us a message and describe how and when we can contact you.',
  placeholderText: 'Enter message...'
}

export const defaultConfigurationDE = {
  titleClosed: 'Chat starten!',
  titleOpen: 'Der Chat ist aktiv.',
  introMessage: 'Guten Tag! Wie können wir Ihnen helfen?',
  autoResponse: 'Der nächste freie Mitarbeiter wird gesucht. Das kann einen kleinen Moment dauern...',
  autoNoResponse: 'Derzeit sind leider alle Mitarbeiter beschäftigt. Bitte hinterlassen Sie uns eine Nachricht' +
    ' und teilen Sie uns mit, wann und wie wir Sie kontaktieren können.',
  placeholderText: 'Nachricht eingeben...'
}
