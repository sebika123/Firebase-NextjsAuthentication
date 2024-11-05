import { SignInButton } from "./AuthButton";
import { UserProfile } from "./UserProfile";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <SignInButton />
      <UserProfile />
    </div>
  );
};

export default Home;
