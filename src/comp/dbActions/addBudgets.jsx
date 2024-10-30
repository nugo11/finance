import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const BudgetForm = ({ budget, onSave }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setAmount(budget.amount);
      setColor(budget.color);
    } else {
      setCategory("");
      setAmount("");
      setColor("");
    }
  }, [budget]);

  const handleAddOrEditBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount || !color) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (budget) {
        const budgetRef = doc(db, "budgets", budget.id);
        await updateDoc(budgetRef, {
          category,
          amount: parseFloat(amount),
          color,
          date: new Date().toISOString(),
        });
        alert("Budget updated successfully!");
        location.reload();
      } else {
        await addDoc(collection(db, "budgets"), {
          category,
          amount: parseFloat(amount),
          color,
          date: new Date().toISOString(),
        });
        alert("Budget added successfully!");
        location.reload();
      }

      onSave();
      setCategory("");
      setAmount("");
      setColor("");
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget.");
    }
  };

  return (
    <form onSubmit={handleAddOrEditBudget} id="addamount">
      <div className="addbudgetfields">
        <label>Budget Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Dining Out">Dining Out</option>
          <option value="Personal Care">Personal Care</option>
        </select>
      </div>
      <div className="addbudgetfields">
        <label>Maximum Spend:</label>
        <input
          type="number"
          placeholder="$ e.g. 2000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
      <button type="submit">{budget ? "Update Budget" : "Add Budget"}</button>
    
    </form>
  );
};

export default BudgetForm;
