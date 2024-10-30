import "./App.css";
import "./AppTablet.css";
import "./AppPhone.css";
import Login from "./comp/auth/login";

import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.replace("/home");
    } else {
    }
  });

  return (
    <>
      <Login />
    </>
  );
}

export default App;
