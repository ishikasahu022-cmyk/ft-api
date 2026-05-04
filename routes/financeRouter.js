import express from "express";
import { addBudget, addCategory, addTransaction, deleteBudget, deleteCategory, deleteTransaction, exportPdf, fetchBudget, fetchCategory, fetchTransaction } from "../controler/financeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addBudgetValidator, addCategoryValidator, addTransactionValidator } from "../validators/financeValidator.js";

const router = express.Router();

//Category
router.post('/add-category', authMiddleware, addCategoryValidator, addCategory);
router.get('/category-list', authMiddleware, fetchCategory);
router.delete('/delete-category/:id', authMiddleware, deleteCategory);

//Transaction
router.post('/add-transaction', authMiddleware, addTransactionValidator, addTransaction);
router.get('/transaction-list', authMiddleware, fetchTransaction);
router.delete('/delete-transaction/:id', authMiddleware, deleteTransaction);
router.get('/export-pdf', authMiddleware, exportPdf);

//Budget
router.post('/add-budget', authMiddleware, addBudgetValidator, addBudget);
router.get('/budget-list', authMiddleware, fetchBudget);
router.delete('/delete-budget/:id', authMiddleware, deleteBudget);

export default router