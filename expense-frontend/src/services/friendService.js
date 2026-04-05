import { fetchWithAuth } from './api';

export const getFriends = async () => fetchWithAuth('/friends');
export const sendFriendRequest = async (email) => fetchWithAuth('/friends/request', { method: 'POST', body: JSON.stringify({ email }) });
export const acceptFriendRequest = async (requesterId) => fetchWithAuth('/friends/accept', { method: 'POST', body: JSON.stringify({ requesterId }) });
export const rejectFriendRequest = async (requesterId) => fetchWithAuth('/friends/reject', { method: 'POST', body: JSON.stringify({ requesterId }) });