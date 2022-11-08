const authProvider = {

  login: async ({ user, token }: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return Promise.resolve()
  },

  checkAuth: () =>
    localStorage.getItem('token') ? Promise.resolve() : Promise.reject(),

  checkError:  async (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      await authProvider.logout()
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: () =>
    Promise.resolve(JSON.parse(localStorage.getItem('user') || "")),

  getPermissions: () => JSON.parse(localStorage.getItem('user') || "").roles,
};

export default authProvider;
