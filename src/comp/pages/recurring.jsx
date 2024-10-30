import Sidebar from "../parts/sidebar";
import searchIcon from "../../../public/assets/icons/search.svg";
import profilePic1 from "../../../public/assets/profielPics/pic1.png";
import allwoIcon from "../../../public/assets/icons/allow.svg";
import disallwoIcon from "../../../public/assets/icons/disallow.svg";
import billIcon from "../../../public/assets/icons/bills.svg";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useEffect, useMemo, useState } from "react";

export default function Recurring() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("oldest");

  const fetchTransactions = async () => {
    try {
      const qall = query(collection(db, "bills"));
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
    fetchTransactions();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "oldest":
        filtered.sort((a, b) => a.date - b.date);
        break;
      case "latest":
        filtered.sort((a, b) => b.date - a.date);
        break;
      case "a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
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
  }, [items, searchTerm, sortOption]);

  if (loading) {
    return <span class="loader"></span>;
  }

  const payDate = 21;

  return (
    <>
      <div className="mineCard">
        <Sidebar />
        <div className="budgetCard">
          <div className="budgetHeader">
            <h1>Recurring Bills</h1>
          </div>
          <div className="twoRows" id="billPage">
            <div className="firstRectRow">
              <div className="rectotalbills">
                <img src={billIcon} alt="icon" width={30} />
                <span>Total Bills</span>
                <b>
                  $
                  {parseInt(
                    filteredItems.reduce((ii, amo) => ii + amo.amount, 0)
                  )}
                </b>
              </div>

              <div className="recSummeri">
                <h1>Summary</h1>
                <ul>
                  <li>
                    Paid Bills{" "}
                    <b>
                      {filteredItems.filter((i) => i.date < 21).length} ($
                      {parseInt(
                        items
                          .filter((i) => i.date < 21)
                          .reduce((ii, amo) => ii + amo.amount, 0)
                      )}
                      )
                    </b>
                  </li>
                  <li>
                    Total Upcoming{" "}
                    <b>
                      {filteredItems.filter((i) => i.date > 23).length} ($
                      {parseInt(
                        items
                          .filter((i) => i.date > 23)
                          .reduce((ii, amo) => ii + amo.amount, 0)
                      )}
                      )
                    </b>
                  </li>
                  <li style={{ color: "red", borderBottom: "none" }}>
                    Due Soon{" "}
                    <b>
                      {
                        filteredItems.filter(
                          (i) => i.date >= 21 && i.date <= 24
                        ).length
                      }{" "}
                      ($
                      {parseInt(
                        items
                          .filter((i) => i.date >= 21 && i.date <= 24)
                          .reduce((ii, amo) => ii + amo.amount, 0)
                      )}
                      )
                    </b>
                  </li>
                </ul>
              </div>
            </div>
            <div className="secondBudgetRow">
              <div className="TransPageList">
                <div className="transPageHeader">
                  <div className="transSearch">
                    <input
                      type="text"
                      placeholder="Search transaction"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={searchIcon} alt="icon" />
                  </div>
                  <div className="transpagesorts">
                    <div className="sortLatest" id="billpageLatestsort">
                      <span>Sort by</span>
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="oldest">Oldest</option>
                        <option value="latest">Latest</option>
                        <option value="a-z">A to Z</option>
                        <option value="z-a">Z to A</option>
                        <option value="highest">Highest</option>
                        <option value="lowest">Lowest</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="translist">
                  <div className="translistheader" id="recPageList">
                    <ul>
                      <li>Recipient / Sender</li>
                      <li style={{ fontWeight: "lighter" }}>Category</li>
                      <li style={{ fontWeight: "lighter" }}>Amount</li>
                    </ul>
                  </div>

                  <div className="translistPageItems">
                    {filteredItems.map((item, index) => (
                      <div
                        className="translistPageitem"
                        id="recPageListName1"
                        key={index}
                      >
                        <div className="translistname" id="recPageListName">
                          <img src={profilePic1} alt="profilePic" />
                          <span>{item.name}</span>
                        </div>
                        <p className={payDate > item.date ? "billgreen" : ""}>
                          Monthly - {item.date}nd{" "}
                          {payDate > item.date ? (
                            <img src={allwoIcon} alt="icon" />
                          ) : (
                            (item.date == 21 ||
                              item.data == 22 ||
                              item.date == 23) && (
                              <img src={disallwoIcon} alt="icon" />
                            )
                          )}
                        </p>
                        <p
                          style={{
                            color:
                              item.date == 21 ||
                              item.data == 22 ||
                              item.date == 23
                                ? "red"
                                : "gray",
                          }}
                        >
                          ${item.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
