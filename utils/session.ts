import { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'mar-al-artigos-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// Tipagem da sessão
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      isLoggedIn: true;
    };
  }
}