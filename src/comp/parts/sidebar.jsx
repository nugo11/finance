import logo from "../../../public/assets/Logo.png";
import homeicon from "../../../public/assets/icons/home.svg";
import trans from "../../../public/assets/icons/trans.svg";
import budget from "../../../public/assets/icons/budgets.svg";
import pots from "../../../public/assets/icons/pots.svg";
import rec from "../../../public/assets/icons/rec.svg";
import arrow from "../../../public/assets/icons/arrow.svg";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase/firebase.js";

export default function Sidebar() {

    const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const [minimized, setMinimized] = useState(false);

  function minimizeON() {
    setMinimized(true)
    localStorage.setItem('min', true)
  }

  function minimizeOFF() {
    setMinimized(false)
    localStorage.setItem('min', false)
  }

  

  const href = location.href

  return (
    <div
      className="leftSidebar"
      style={{ width: "20%" }}
      id={minimized ? "Minimized" : "Minimize"}
    >
      <img src={logo} alt="logo" className="sideLogo" />
      <div className="side1">
        <div className="sidenav">
          <ul>
            <Link to="/home">
              <li className={href.includes('home') ? "activeNavBut" : "inactiveNavBut"}>
                <img src={homeicon} alt="icon" />
                <span>Overview</span>
              </li>
            </Link>
            <Link to="/transactions">
              <li className={href.includes('transactions') ? "activeNavBut" : "inactiveNavBut"}>
                <img src={trans} alt="icon" />
                <span>Transactions</span>
              </li>
            </Link>
            <Link to="/budgets">
              <li className={href.includes('budgets') ? "activeNavBut" : "inactiveNavBut"}>
                <img src={budget} alt="icon" />
                <span>Budgets</span>
              </li>
            </Link>
            <Link to="/pots">
              <li className={href.includes('pots') ? "activeNavBut" : "inactiveNavBut"}>
                <img src={pots} alt="icon" />
                <span>Pots</span>
              </li>
            </Link>
            <Link to="/recurring">
              <li className={href.includes('recurring') ? "activeNavBut" : "inactiveNavBut"}>
                <img src={rec} alt="icon" />
                <span>Recurring Bills</span>
              </li>
            </Link>
          </ul>
        </div>
        <button onClick={handleSignOut} className="signOutButton">
          Sign Out
        </button>
      </div>
      <div
        className="side2"
        onClick={() => (minimized ? minimizeOFF() : minimizeON())}
      >
        <img src={arrow} alt="icon" />
        <span>Minimize Menu</span>
      </div>
    </div>
  );
}
