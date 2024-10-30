import Sidebar from "../parts/sidebar";
import { useEffect, useState, useMemo } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/firebase";
import { Link } from "react-router-dom";

export default function Transactions() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [user, setUser] = useState(null);

  const fetchTransactions = async () => {
    try {
      const qall = query(collection(db, "transactions"));
      const querySnapshot = await getDocs(qall);
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(fetchedItems);
      setTimeout(() => {
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.rerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    switch (sortOption) {
      case "latest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "a-z":
        filtered.sort((a, b) => a.rerson.localeCompare(b.rerson));
        break;
      case "z-a":
        filtered.sort((a, b) => b.rerson.localeCompare(a.rerson));
        break;
      case "highest":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    return filtered;
  }, [items, searchTerm, sortOption, categoryFilter]);

  if (loading) {
    return <span className="loader"></span>;
  }

  return (
    <>
    {user ?  <div className="mineCard">
        <Sidebar />
        <div className="Transcard">
          <h1>Transactions</h1>

          <div className="TransPageList">
            <div className="transPageHeader">
              <div className="transSearch">
                <input
                  type="text"
                  placeholder="Search transaction"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src="/assets/icons/search.svg" alt="Search Icon" />
              </div>
              <div className="transpagesorts">
                <div className="sortLatest">
                  <span>Sort by</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="a-z">A to Z</option>
                    <option value="z-a">Z to A</option>
                    <option value="highest">Highest</option>
                    <option value="lowest">Lowest</option>
                  </select>
                </div>
                <div className="sortLatest">
                  <span>Category</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Transactions</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Bills">Bills</option>
                    <option value="Dining Out">Dining Out</option>
                    <option value="Personal Care">Personal Care</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="translist">
              <div className="translistheader">
                <ul>
                  <li>Recipient / Sender</li>
                  <li>Category</li>
                  <li>Transaction Date</li>
                  <li>Amount</li>
                </ul>
              </div>

              <div className="translistPageItems">
                {filteredItems.map((item, index) => (
                  <div
                    className="translistPageitem"
                    id="translistPageitemmi"
                    key={index}
                  >
                    <div className="translistname" id="translistnamee">
                      <img
                        src="/assets/profielPics/pic1.png"
                        alt="Profile Pic"
                      />
                      <span>{item.rerson}</span>
                    </div>

                    <p>{item.category}</p>
                    <p>{item.date}</p>
                    <p className={item.type === "plus" ? "greentext" : ""}>
                      {item.type === "plus" ? "+" : "-"}${item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> : <center>You need Log In for see this page <Link to="/">Log In</Link></center>}
     
    </>
  );
}
