/** @type {import('expo/config').ExpoConfig} */
const appJson = require('./app.json');

const LAN_IP = process.env.LAN_IP || appJson.expo?.extra?.lanIp || 'localhost';

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      lanIp: LAN_IP,
      ...(process.env.EXPO_PUBLIC_API_URL
        ? { apiUrl: process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '') }
        : {}),
    },
  },
};
