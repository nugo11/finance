import Sidebar from "../parts/sidebar";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import PotsForm from "../dbActions/addPots";

export default function Pots() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [close, setClose] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [activePot, setActivePot] = useState(null);

  const fetchTransactions = async () => {
    try {
      const qall = query(collection(db, "pots"));
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

  const handleEditBudget = (item) => {
    setSelectedBudget(item);
    setClose(false);
  };

  const handleDeleteBudget = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Pot?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "pots", id));
        alert("Pots deleted successfully!");
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting Pots:", error);
        alert("Failed to delete Pots.");
      }
    }
  };

  const handleAddMoney = async () => {
    if (!activePot) return;

    const newAmount = activePot.amount + parseFloat(amount);
    try {
      await updateDoc(doc(db, "pots", activePot.id), { amount: newAmount });
      fetchTransactions();
      setIsAddModalOpen(false);
      setAmount(0);
    } catch (error) {
      console.error("Error adding money:", error);
    }
  };

  const handleWithdrawMoney = async () => {
    if (!activePot || amount > activePot.amount) {
      alert("Insufficient balance!");
      return;
    }

    const newAmount = activePot.amount - parseFloat(amount);
    try {
      await updateDoc(doc(db, "pots", activePot.id), { amount: newAmount });
      fetchTransactions();
      setIsWithdrawModalOpen(false);
      setAmount(0);
    } catch (error) {
      console.error("Error withdrawing money:", error);
    }
  };

  const openAddModal = (pot) => {
    setActivePot(pot);
    setIsAddModalOpen(true);
  };

  const openWithdrawModal = (pot) => {
    setActivePot(pot);
    setIsWithdrawModalOpen(true);
  };

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

  if (loading) {
    return <span class="loader"></span>;
  }

  return (
    <>
      <div className="darkBG" id={close ? "closedBg" : "openedBG"}>
        <div className="modal">
          <div className="modalHeader">
            <h1>Add New Pot</h1>
            <button onClick={() => setClose(true)}>X</button>
          </div>
          <p>
            Create a pot to set savings targets. These can help keep you on
            track as you save for special purchases.
          </p>
          <PotsForm budget={selectedBudget} onSave={fetchTransactions} />
        </div>
      </div>

      <div className="mineCard">
        <Sidebar />
        <div className="budgetCard">
          <div className="budgetHeader">
            <h1>Pots</h1>
            <button
              onClick={() => {
                setClose(false);
                setSelectedBudget(null);
              }}
            >
              + Add New Pots
            </button>
          </div>
          <div className="potsBoxses">
            {items.map((i, index) => (
              <div className="budgetbox" key={index}>
                <div className="budgetboxheader">
                  <div className="oneinbudgetboxheader">
                    <div
                      className="circle"
                      style={{
                        backgroundColor: getBackgroundColor(i.color),
                      }}
                    ></div>
                    <h1>{i.name}</h1>
                  </div>
                  <div className="editdelbut">
                    <button
                      onClick={() =>
                        setEditIndex(editIndex === index ? null : index)
                      }
                    >
                      ...
                    </button>
                    <div
                      onMouseLeave={() => setEditIndex(null)}
                      className="EditBudget"
                      id={editIndex === index ? "hidebuto" : "hidebuto1"}
                    >
                      <ul>
                        <li onClick={() => handleEditBudget(i)}>Edit Budget</li>
                        <li
                          onClick={() => handleDeleteBudget(i.id)}
                          style={{ color: "#C94736" }}
                        >
                          Delete Budget
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="budgetProgress">
                  <div className="prorgesstworow">
                    <span>Total Saved</span>
                    <b>${i.amount}</b>
                  </div>
                  <div className="progressbaer" style={{ height: "10px" }}>
                    <div
                      className="progressi"
                      style={{
                        width: `${Math.min((i.amount / i.target) * 100, 100)}%`,
                        height: "9px",
                        backgroundColor: getBackgroundColor(i.color),
                      }}
                    ></div>
                  </div>
                  <div className="progressAmounti">
                    <div className="spent">
                      <span>{((i.amount / i.target) * 100).toFixed(2)}%</span>
                    </div>
                    <div className="spent">
                      <span>Target of ${i.target}</span>
                    </div>
                  </div>
                </div>
                <div className="potsButs">
                  <button onClick={() => openAddModal(i)}>+ Add Money</button>
                  <button onClick={() => openWithdrawModal(i)}>Withdraw</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="darkBG" style={{ display: "block" }}>
          <div className="modal">
            <div className="modalHeader">
              <h1>Add to "{activePot.name}"</h1>
              <button onClick={() => setIsAddModalOpen(false)}>X</button>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi
              neque, aliquet.
            </p>
            <div id="addamount">
              <div className="addbudgetfields">
                <div className="budgetProgress">
                  <div className="prorgesstworow">
                    <span>New Amount</span>
                    <b>${activePot.amount}</b>
                  </div>
                  <div className="progressbaer" style={{ height: "10px" }}>
                    <div
                      className="progressi"
                      style={{
                        width: `${Math.min(
                          (activePot.amount / activePot.target) * 100,
                          100
                        )}%`,
                        height: "9px",
                        backgroundColor: getBackgroundColor(activePot.color),
                      }}
                    ></div>
                  </div>
                  <div className="progressAmounti">
                    <div className="spent">
                      <span>
                        {((activePot.amount / activePot.target) * 100).toFixed(
                          2
                        )}
                        %
                      </span>
                    </div>
                    <div className="spent">
                      <span>Target of ${activePot.target}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="addbudgetfields">
                <p>Amount to Add:</p>
                <input
                  type="number"
                  value={amount}
                  placeholder="$"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <button onClick={handleAddMoney}>Confirm Addition</button>
            </div>
          </div>
        </div>
      )}

      {isWithdrawModalOpen && (
        <div className="modal">
          <div className="modalHeader">
            <h1>Withdraw from "Savings"</h1>
            <button onClick={() => setIsWithdrawModalOpen(false)}>X</button>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus
            hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque,
            aliquet.
          </p>
          <div id="addamount">
            <div className="addbudgetfields">
              <label>New Amount:</label>
            </div>
            <div className="addbudgetfields">
              <label>Amount to Add:</label>
              <input
                type="number"
                value={amount}
                placeholder="$"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button onClick={handleWithdrawMoney}>Confirm Withdrawal</button>
          </div>
        </div>
      )}
    </>
  );
}
