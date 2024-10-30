import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const PotsForm = ({ budget, onSave }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [target, setTarget] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (budget) {
      setCategory(budget.name);
      setTarget(budget.amount);
      setColor(budget.color);
    } else {
      setCategory("");
      setTarget("");
      setColor("");
    }
  }, [budget]);

  const handleAddOrEditBudget = async (e) => {
    e.preventDefault();
    if (!category || !color || !target) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (budget) {
        const budgetRef = doc(db, "pots", budget.id);
        await updateDoc(budgetRef, {
          name: category,
          amount: parseFloat(amount),
          target: parseFloat(target),
          color,
          date: new Date().toISOString(),
        });
        alert("Pot updated successfully!");
        location.reload();
      } else {
        await addDoc(collection(db, "pots"), {
          name: category,
          amount: parseFloat(amount),
          target: parseFloat(target),
          color,
          date: new Date().toISOString(),
        });
        alert("Pot added successfully!");
        location.reload();
      }

      onSave();
      setCategory("");
      setTarget("");
      setAmount(0);
      setColor("");
    } catch (error) {
      console.error("Error saving Pot:", error);
    }
  };

  return (
    <form onSubmit={handleAddOrEditBudget} id="addamount">
      <div className="addbudgetfields">
        <label>Pot Name:</label>
        <input
          type="text"
          placeholder="e.g. Rainy Days"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="addbudgetfields">
        <label>Target:</label>
        <input
          type="number"
          placeholder="$ e.g. 2000"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </div>
      <div className="addbudgetfields">
        <label>Theme:</label>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">Select color</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="cyan">Cyan</option>
          <option value="Navy">Navy</option>
        </select>
      </div>
      <button type="submit">{budget ? "Update Pots" : "Add Pots"}</button>
    
    </form>
  );
};

export default PotsForm;
