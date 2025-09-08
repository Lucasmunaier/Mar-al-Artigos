import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from './session';

export default function withAuth<P extends { [key: string]: any }>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }

    return handler(context);
  }, sessionOptions);
}

// Você pode usar essa versão se a página não tiver `getServerSideProps` próprios.
export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
    const user = req.session.user;
  
    if (!user) {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
  
    return {
      props: { user },
    };
  }, sessionOptions);