import BuildClient from '../api/build-client';
const LandingPage = ({ currentUser }) => {
  const loginStatus = currentUser ? 'you are signed in' : 'you are not signed in';
  return <h1>{loginStatus}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = BuildClient(context);
  const { data } = await client.get('/api/users/currentUser');

  return data;
};

export default LandingPage;
