// api/expenses.js

// IN-MEMORY STORAGE
// Note: This data is ephemeral. It will be lost when the lambda function restarts.
const expenses = [];

export default function handler(req, res) {
  const { method } = req;

  // 1. Handle GET Request (Retrieve all expenses)
  if (method === 'GET') {
    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  }

  // 2. Handle POST Request (Add a new expense)
  if (method === 'POST') {
    // Destructure fields from the request body
    const { amount, description, category, date } = req.body;

    // Validation: Check for missing fields
    if (!amount || !description || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide amount, description, category, and date.',
      });
    }

    // Create the new expense object
    const newExpense = {
      id: Date.now().toString(), // Simple unique ID based on timestamp
      amount: parseFloat(amount), // Ensure amount is a number
      description,
      category,
      date,
      createdAt: new Date().toISOString(),
    };

    // Add to memory array
    expenses.push(newExpense);

    // Respond with the created resource
    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense,
    });
  }

  // 3. Handle Unsupported Methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({
    success: false,
    error: `Method ${method} Not Allowed`,
  });
}
