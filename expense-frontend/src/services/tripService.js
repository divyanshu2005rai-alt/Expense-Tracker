import { fetchWithAuth } from './api';

export const createTrip = async (tripData) => fetchWithAuth('/trips', { method: 'POST', body: JSON.stringify(tripData) });
export const getTrips = async () => fetchWithAuth('/trips');
export const getTripActivity = async (tripId) => fetchWithAuth(`/trips/${tripId}/activity`);
export const endTrip = async (tripId) => fetchWithAuth(`/trips/${tripId}/end`, { method: 'PUT' });
export const acceptTripInvitation = async (tripId) => fetchWithAuth(`/trips/${tripId}/accept`, { method: 'POST' });
export const rejectTripInvitation = async (tripId) => fetchWithAuth(`/trips/${tripId}/reject`, { method: 'POST' });
export const deleteTrip = async (tripId) => fetchWithAuth(`/trips/${tripId}`, { method: 'DELETE' });