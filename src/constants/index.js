import ROUTES from './routes';

export { ROUTES };

export const formatDuration = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    timeZone: 'Europe/London',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  };
  const timeString = date.toLocaleTimeString('en-GB', options);
  return timeString;
};
