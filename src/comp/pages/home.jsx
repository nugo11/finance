import { Link } from "react-router-dom";
import DoughnutChart from "../chart.jsx";
import Sidebar from "../parts/sidebar.jsx";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function Home() {
  const [EntertainmenttotalAmount, setEntertainmentTotalAmount] = useState(0);
  const [BillttotalAmount, setBillTotalAmount] = useState(0);
  const [DiningOuttotalAmount, setDiningOutTotalAmount] = useState(0);
  const [pqtotalAmount, setpqTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items1, setItems1] = useState([]);
  const [items, setItems] = useState([]);
  const [potsItem, setPots] = useState([]);
  const [billsItem, setBills] = useState([]);

  const fetchPersonalCareItems = async () => {
    try {
      const qallPot = query(collection(db, "pots"));
      const querySnapshotPot = await getDocs(qallPot);
      const potsItem = querySnapshotPot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPots(potsItem);

      const qallbill = query(collection(db, "bills"));
      const querySnapshotbill = await getDocs(qallbill);
      const billsItem = querySnapshotbill.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBills(billsItem);

      const q = query(
        collection(db, "budgets"),
        where("category", "==", "Entertainment")
      );

      const qb = query(
        collection(db, "budgets"),
        where("category", "==", "Bills")
      );

      const qd = query(
        collection(db, "budgets"),
        where("category", "==", "Dining Out")
      );

      const qp = query(
        collection(db, "budgets"),
        where("category", "==", "Personal Care")
      );

      const qall = query(collection(db, "budgets"));

      const querySnapshoti = await getDocs(qall);
      const fetchedItems = querySnapshoti.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const querySnapshot = await getDocs(q);
      const total = querySnapshot.docs.reduce((sum, doc) => {
        return sum + parseFloat(doc.data().amount);
      }, 0);

      const querySnapshot1 = await getDocs(qb);
      const total1 = querySnapshot1.docs.reduce((sum, doc) => {
        return sum + parseFloat(doc.data().amount);
      }, 0);

      const querySnapshot2 = await getDocs(qd);
      const total2 = querySnapshot2.docs.reduce((sum, doc) => {
        return sum + parseFloat(doc.data().amount);
      }, 0);

      const querySnapshot3 = await getDocs(qp);
      const total3 = querySnapshot3.docs.reduce((sum, doc) => {
        return sum + parseFloat(doc.data().amount);
      }, 0);

      setEntertainmentTotalAmount(total);
      setBillTotalAmount(total1);
      setDiningOutTotalAmount(total2);
      setpqTotalAmount(total3);
      setItems(fetchedItems);
      setTimeout(() => {
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error("Error fetching Personal Care items:", error);
    }
  };

  const fetchPersonalCareItems1 = async () => {
    try {
      const qall = query(collection(db, "transactions"));

      const querySnapshoti = await getDocs(qall);
      const fetchedItems = querySnapshoti.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems1(fetchedItems);
    } catch (error) {
      console.error("Error fetching Personal Care items:", error);
    }
  };

  useEffect(() => {
    fetchPersonalCareItems();
    fetchPersonalCareItems1();
  }, []);

  if (loading) {
    return <span class="loader"></span>;
  }

  const rame = items.map((ii) => {
    return items1.reduce((total, i) => {
      if (i.category === ii.category) {
        return i.type === "plus" ? total - i.amount : total + i.amount;
      }
      return total;
    }, 0);
  });

  let sum = 0;
  for (const el of rame) {
    sum += el;
  }

  return (
    <>
      <div className="mineCard">
        <Sidebar />
        <div className="card" style={{ width: "75%" }}>
          <div className="overview">
            <h1>Overview</h1>
            <div className="balanceCards">
              <ul>
                <li>
                  <span>Current Balance</span>
                  <p>$4,836.00</p>
                </li>
                <li>
                  <span>Income</span>
                  <p>$3,814.25</p>
                </li>
                <li>
                  <span>Expenses</span>
                  <p>$1,700.50</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="twoRows">
            <div className="firstRow">
              <div className="pots">
                <div className="potsHead">
                  <h3>Pots</h3>
                  <Link to="/pots">
                    See Details <img src='/public/assets/icons/ph_caret-down-fill.png' alt="icon" />
                  </Link>
                </div>
                <div className="postbody">
                  <div className="postBody1">
                    <img src='/public/assets/icons/potIcon.svg' alt="icon" />
                    <p>
                      Total Saved{" "}
                      <span>
                        $
                        {potsItem.find((i) => i.name === "Savings" && i.amount)
                          .amount +
                          potsItem.find((i) => i.name === "Gift" && i.amount)
                            .amount +
                          potsItem.find(
                            (i) => i.name === "Concert Ticket" && i.amount
                          ).amount +
                          potsItem.find(
                            (i) => i.name === "New Laptop" && i.amount
                          ).amount}
                      </span>
                    </p>
                  </div>
                  <div className="postbody2">
                    <ul>
                      <li>
                        Savings
                        <span>
                          $
                          {
                            potsItem.find(
                              (i) => i.name === "Savings" && i.amount
                            ).amount
                          }
                        </span>
                      </li>
                      <li>
                        Gift{" "}
                        <span>
                          $
                          {
                            potsItem.find((i) => i.name === "Gift" && i.amount)
                              .amount
                          }
                        </span>
                      </li>
                      <li>
                        Concert Ticket{" "}
                        <span>
                          $
                          {
                            potsItem.find(
                              (i) => i.name === "Concert Ticket" && i.amount
                            ).amount
                          }
                        </span>
                      </li>
                      <li>
                        New Laptop{" "}
                        <span>
                          $
                          {
                            potsItem.find(
                              (i) => i.name === "New Laptop" && i.amount
                            ).amount
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="Trans">
                <div className="potsHead">
                  <h3>Transactions</h3>
                  <Link to="/transactions">
                    View All <img src='/public/assets/icons/ph_caret-down-fill.png' alt="icon" />
                  </Link>
                </div>
                <div className="transBody">
                  <div className="translist">
                    {items1.map((i, index) => (
                      <div className="translistitem" key={index}>
                        <div className="translistname">
                          <img src='/public/assets/profielPics/pic1.png' alt="profilePic" />
                          <span id="transpagetitlererson">{i.rerson}</span>
                        </div>
                        <div className="translistinfo">
                          <span
                            className={i.type === "plus" ? "greentext" : ""}
                          >
                            {i.type === "plus" ? "+" : "-"}${i.amount}
                          </span>
                          <p>{i.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="secondRows">
              <div className="budgets">
                <div className="potsHead">
                  <h3>Budgets</h3>
                  <Link to="/budgets">
                    See Details <img src='/public/assets/icons/ph_caret-down-fill.png' alt="icon" />
                  </Link>
                </div>
                <div className="chartspace">
                  {EntertainmenttotalAmount === 0 ? (
                    <p>No items found.</p>
                  ) : (
                    <DoughnutChart
                      Entert={EntertainmenttotalAmount}
                      Bill={BillttotalAmount}
                      DiningOuttotalAmount={DiningOuttotalAmount}
                      pqtotalAmount={pqtotalAmount}
                      sum={sum}
                    />
                  )}
                </div>
              </div>
              <div className="reccuring">
                <div className="potsHead">
                  <h3>Recurring Bills</h3>
                  <Link to="/recurring">
                    See Details <img src='/public/assets/icons/ph_caret-down-fill.png' alt="icon" />
                  </Link>
                </div>
                <ul>
                  {billsItem.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.name} <span>${item.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
