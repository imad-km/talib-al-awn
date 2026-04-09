export const API_BASE = import.meta.env.API_BASE || '/api';

const _setTokens = (access, refresh) => {
    localStorage.setItem('ta_access', access);
    localStorage.setItem('ta_refresh', refresh);
};

const _getAccess = () => localStorage.getItem('ta_access');
const _getRefresh = () => localStorage.getItem('ta_refresh');

export const clearTokens = () => {
    localStorage.removeItem('ta_access');
    localStorage.removeItem('ta_refresh');
    localStorage.removeItem('ta_profile');
};

const _cacheProfile = (profile) => {
    localStorage.setItem('ta_profile', JSON.stringify(profile));
};

export const getCachedProfile = () => {
    try { return JSON.parse(localStorage.getItem('ta_profile')); }
    catch { return null; }
};

export async function apiCall(method, path, body = null, retry = true) {
    const token = _getAccess();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    let res;
    try {
        res = await fetch(`${API_BASE}${path}`, opts);
    } catch (error) {
        console.error('Network error:', error);
        return { ok: false, error: 'تعذّر الاتصال بالخادم. تأكد من تشغيل الخادم.' };
    }
    if (res.status === 401 && retry) {
        const refreshed = await _doRefresh();
        if (refreshed) return apiCall(method, path, body, false);
        clearTokens();
        window.location.href = '/login';
        return { ok: false, error: 'Session expired.' };
    }
    let json;
    try {
        json = await res.json();
    } catch (error) {
        console.error('JSON parse error:', error);
        return { ok: false, error: 'استجابة غير صالحة من الخادم.' };
    }
    return json;
}

async function _doRefresh() {
    const refresh = _getRefresh();
    if (!refresh) return false;
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${refresh}`, 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (json.ok && json.data?.access_token) {
            localStorage.setItem('ta_access', json.data.access_token);
            return true;
        }
    } catch { }
    return false;
}

export async function getAuthUser() {
    if (!_getAccess()) return null;
    const r = await apiCall('GET', '/auth/me');
    if (!r.ok) return null;
    _cacheProfile(r.data);
    return r.data;
}

export async function signIn({ email, password }) {
    const r = await apiCall('POST', '/auth/login', { email, password });
    if (!r.ok) return { data: null, error: { message: r.error } };
    _setTokens(r.data.access_token, r.data.refresh_token);
    _cacheProfile(r.data.user);
    return { data: { user: r.data.user }, error: null };
}

export async function signUpWithOtp({ email, password, metadata = {} }) {
    const r = await apiCall('POST', '/auth/register/send-otp', { email, password, ...metadata });
    return r.ok ? { error: null } : { error: { message: r.error } };
}

export async function verifyEmailOtp({ email, token }) {
    const r = await apiCall('POST', '/auth/register/verify-otp', { email, otp: token });
    if (!r.ok) return { error: { message: r.error } };
    _setTokens(r.data.access_token, r.data.refresh_token);
    _cacheProfile(r.data.user);
    return { data: { user: r.data.user }, error: null };
}

export async function sendPasswordResetOtp(email) {
    const r = await apiCall('POST', '/auth/forgot-password', { email });
    return r.ok ? { error: null } : { error: { message: r.error } };
}

export async function verifyPasswordResetOtp({ email, token }) {
    const r = await apiCall('POST', '/auth/verify-reset-otp', { email, otp: token });
    return r.ok ? { error: null } : { error: { message: r.error } };
}

export async function updatePassword(email, otp, newPassword) {
    const r = await apiCall('POST', '/auth/reset-password', { email, otp, new_password: newPassword });
    return r.ok ? { error: null } : { error: { message: r.error } };
}

export function signOut() {
    clearTokens();
    window.location.href = '/login';
}
