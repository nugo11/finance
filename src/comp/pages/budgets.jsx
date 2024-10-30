import DoughnutChart from "../chart";
import Sidebar from "../parts/sidebar";
import BudgetForm from "../dbActions/addBudgets";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function Budgets() {
  const [close, setClose] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [EntertainmenttotalAmount, setEntertainmentTotalAmount] = useState(0);
  const [BillttotalAmount, setBillTotalAmount] = useState(0);
  const [DiningOuttotalAmount, setDiningOutTotalAmount] = useState(0);
  const [pqtotalAmount, setpqTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [items1, setItems1] = useState([]);

  const handleEditBudget = (item) => {
    setSelectedBudget(item);
    setClose(false);
  };

  const handleDeleteBudget = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "budgets", id));
        alert("Budget deleted successfully!");
        fetchPersonalCareItems();
      } catch (error) {
        console.error("Error deleting budget:", error);
        alert("Failed to delete budget.");
      }
    }
  };

  const handleSave = () => {
    setSelectedBudget(null);
    fetchPersonalCareItems();
    setClose(true);
  };

  const fetchPersonalCareItems = async () => {
    try {
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

  const getBackgroundColor = (color) => {
    switch (color) {
      case "green":
        return "#277C78";
      case "yellow":
        return "#F2CDAC";
      case "cyan":
        return "#82C9D7";
      case "Navy":
        return "#626070";
      default:
        return "transparent";
    }
  };

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
      <div className="darkBG" id={close ? "closedBg" : "openedBG"}>
        <div className="modal">
          <div className="modalHeader">
            <h1>Add New Budget</h1>
            <button onClick={() => setClose(true)}>X</button>
          </div>
          <p>
            Choose a category to set a spending budget. These categories can
            help you monitor spending.
          </p>
          <BudgetForm budget={selectedBudget} onSave={handleSave} />
        </div>
      </div>

      <div className="mineCard">
        <Sidebar />
        <div className="budgetCard">
          <div className="budgetHeader">
            <h1>Budgets</h1>
            <button
              onClick={() => {
                setClose(false);
                setSelectedBudget(null);
              }}
            >
              + Add New Budget
            </button>
          </div>
          <div className="twoRows">
            <div className="firstBudgetRow">
              <div className="chartspace">
                {EntertainmenttotalAmount === 0 ? (
                  <p>Searching...</p>
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
            <div className="secondBudgetRow">
              {items.map((item, index) => (
                <div className="budgetbox" key={index}>
                  <div className="budgetboxheader">
                    <div className="oneinbudgetboxheader">
                      <div
                        className="circle"
                        style={{
                          backgroundColor: getBackgroundColor(item.color),
                        }}
                      ></div>
                      <h1>{item.category}</h1>
                    </div>
                    <div className="editdelbut">
                      <button
                        onClick={() => {
                          setEditIndex(editIndex === index ? null : index);
                        }}
                      >
                        ...
                      </button>
                      <div
                        onMouseLeave={() => setEditIndex(null)}
                        className="EditBudget"
                        id={editIndex === index ? "hidebuto" : "hidebuto1"}
                      >
                        <ul>
                          <li onClick={() => handleEditBudget(item)}>
                            Edit Budget
                          </li>
                          <li
                            onClick={() => handleDeleteBudget(item.id)}
                            style={{ color: "#C94736" }}
                          >
                            Delete Budget
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="budgetProgress">
                    <span>Maximum of ${item.amount}.00</span>
                    <div className="progressbaer">
                      <div
                        className="progressi"
                        style={{
                          width: `${
                            (items1.reduce((total, i) => {
                              if (i.category === item.category) {
                                return i.type === "plus"
                                  ? total - i.amount
                                  : total + i.amount;
                              }
                              return total;
                            }, 0) *
                              100) /
                            item.amount
                          }%`,
                          backgroundColor: getBackgroundColor(item.color),
                        }}
                      ></div>
                    </div>
                    <div className="progressAmount">
                      <div
                        className="spent"
                        style={{
                          borderLeft: `3px solid ${getBackgroundColor(
                            item.color
                          )}`,
                        }}
                      >
                        <span>spent</span>
                        <b>
                          $
                          {items1.reduce((total, i) => {
                            if (i.category === item.category) {
                              return i.type === "plus"
                                ? total - i.amount
                                : total + i.amount;
                            }
                            return total;
                          }, 0)}
                        </b>
                      </div>
                      <div
                        className="spent"
                        style={{ borderLeft: "3px solid #F8F4F0" }}
                      >
                        <span>Remaining</span>
                        <b>
                          $
                          {items1.reduce((budget, i) => {
                            if (i.category === item.category) {
                              return i.type === "plus"
                                ? budget + i.amount
                                : budget - i.amount;
                            }
                            return budget;
                          }, item.amount)}
                        </b>
                      </div>
                    </div>
                  </div>
                  <div className="latestSpending">
                    <h1>Latest Spending</h1>
                    {items1.map((i, index) =>
                      i.category === item.category ? (
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
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
