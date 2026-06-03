export const debug = (...args) => { if (localStorage.getItem('cadeauscope_debug') === '1') console.debug('[CadeauScope]', ...args); };
