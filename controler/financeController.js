import mongoose from "mongoose";
import category from "../models/categoryModel.js";
import user from '../models/userModel.js'
import transaction from "../models/transactionModel.js";
import budget from "../models/budget.js";
import ejs from "ejs"
import path from "path"
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
export const addCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { id, name, categoryType, color } = req.body;

        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        if (id) {
            const categoryData = await category.findOne({ _id: id, userId, isDelete: false });

            if (categoryData) {
                const savedData = await category.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { name, categoryType, color } }, { returnDocument: "after" });

                if (savedData) {
                    res.status(200).json({ message: 'Category updated successfully', data: savedData });
                } else {
                    res.status(400).json({ message: 'Unable to updated category.' });
                }
            } else {
                res.status(400).json({ message: 'Category not found.' });
            }
        } else {
            const categoryData = await category.findOne({ name, isDelete: true });
            if (categoryData) {
                const savedData = await category.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(categoryData._id) }, { $set: { isDelete: false, categoryType, color } }, { returnDocument: "after" });

                if (savedData) {
                    res.status(200).json({ message: 'Category added successfully', data: savedData });
                } else {
                    res.status(400).json({ message: 'Unable to add category.' });
                }
            } else {
                const savedData = new category({ userId, name, categoryType, color });
                await savedData.save();
                res.status(200).json({ message: 'Category added successfully', data: savedData });
            }
        }


    }
    catch (err) {
        if (err.code === 11000) {

            const keyPattern = err.keyPattern || err.keyValue;

            const field = keyPattern ? Object.keys(keyPattern)[1] : null;

            if (field === 'name' || field === 'color') {
                return res.status(400).json({
                    message: `${field === 'name' ? 'Category' : 'Color'} already exists.`
                });
            }

            return res.status(400).json({
                message: "Duplicate value error"
            });
        }

        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const fetchCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const search = req.query.search || '';
        const limit = Number(req.query.perPage);
        const skip = req.query.page ? req.query.page * limit : 0;

        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }
        let match = { isDelete: false }
        if (userId) {
            match.userId = new mongoose.Types.ObjectId(userId)
        }

        if (search) {
            match.name = { $regex: search, $options: "i" }
        }

        const result = await category.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { _id: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                name: 1,
                                categoryType: 1,
                                color: 1,
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }

        ]);

        const categoryData = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        res.status(200).json({ data: categoryData, totalCount: total });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        const categoryData = await category.findOne({ _id: id, userId, isDelete: false });

        if (!categoryData) {
            return res.status(400).json({ message: 'Category not found.' });
        }
        const savedData = await category.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { isDelete: true } });

        if (savedData) {
            res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            res.status(400).json({ message: 'Unable to delete category.' });
        }
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const addTransaction = async (req, res) => {
    try {
        const { id, categoryId, amount, date, note } = req.body;
        const userId = req.userId;
        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }
        const categoryData = await category.findOne({ _id: categoryId, userId, isDelete: false });
        if (!categoryData) {
            return res.status(400).json({ message: 'Category not found' });
        }


        if (id) {
            const transactionData = await transaction.findOne({ _id: id, userId });
            if (!transactionData) {
                return res.status(400).json({ message: 'Transaction not found' });
            }

            const savedData = await transaction.findByIdAndUpdate({ _id: id }, { $set: { categoryId, amount, date, note } }, { returnDocument: 'after' });
            if (savedData) {
                const data = {
                    ...savedData.toObject({ versionKey: false }),
                    categoryName: categoryData.name,
                    categoryType: categoryData.categoryType,
                    color: categoryData.color
                }
                res.status(200).json({ message: 'Transaction updated successfully', data: data });
            } else {
                res.status(400).json({ message: 'Unable to update transaction' });
            }
        } else {
            const savedData = new transaction({ userId, categoryId, amount, date, note });
            await savedData.save();
            const data = {
                ...savedData.toObject({ versionKey: false }),
                categoryName: categoryData.name,
                categoryType: categoryData.categoryType,
                color: categoryData.color
            }
            res.status(200).json({ message: 'Transaction added successfully', data: data });
        }
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const fetchTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        const limit = Number(req.query.perPage) || 0;
        const skip = Number(req.query.page) * limit || 0;
        const search = req.query.search || ''
        const date = Number(req.query.date) * limit || 0;
        const categoryId = req.query.categoryId || '';

        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        const match = { userId: new mongoose.Types.ObjectId(userId) };

        const result = await transaction.aggregate([
            {
                $facet: {
                    data: [
                        {
                            $match: match
                        },
                        { $sort: { _id: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'categoryId',
                                foreignField: '_id',
                                as: 'category'
                            }
                        },
                        {
                            $unwind: '$category',
                        },
                        {
                            $project: {
                                _id: 1,
                                categoryId: 1,
                                amount: 1,
                                date: 1,
                                note: 1,
                                categoryName: "$category.name",
                                categoryType: "$category.categoryType",
                                color: "$category.color"
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'count' },
                    ]
                }
            },

        ]);

        const transactionData = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        res.status(200).json({ message: 'Transaction fetch successfully', data: transactionData, totalCount: total });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        const transactionData = await transaction.findOne({ _id: id, userId });

        if (!transactionData) {
            return res.status(400).json({ message: 'Transaction not found.' });
        }
        const isDeleted = await transaction.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) });

        if (isDeleted) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(400).json({ message: 'Unable to delete transaction.' });
        }
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const exportPdf = async (req, res) => {
    try {

        const html = await ejs.renderFile(path.join(__dirname, '../templates/report.ejs'));

        const browser = await puppeteer.launch({
            headless: "new"
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const fileName = `report-${Date.now()}.pdf`;
        const filePath = path.join(__dirname, `../public/${fileName}`)

        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true
        })
        await browser.close();

        res.status(200).json({ url: `/${fileName}` });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });

    }
}

export const addBudget = async (req, res) => {
    try {
        const userId = req.userId;
        const { id, name, categoryIds, amount, timeFrame, startDate, endDate } = req.body;
        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        const categoryPromises = categoryIds.map(async (categoryId) => {
            const categoryData = await category.findOne({ _id: categoryId, userId, isDelete: false });

            return categoryData;
        });

        const categories = await Promise.all(categoryPromises);
        const isCategoryNotAvalible = await categories.filter((item) => item == null);

        if (isCategoryNotAvalible?.length > 0) {
            return res.status(400).json({ message: 'Invalid categoryIds' });
        }

        if (timeFrame == 'custom' && (!startDate || !endDate)) {
            return res.status(400).json({ message: 'startDate and endDate are require' });
        }
        if (id) {
            const budgetData = await budget.findOne({ _id: id, userId });
            if (!budgetData) {
                return res.status(400).json({ message: 'Transaction not found' });
            }

            const savedData = await budget.findByIdAndUpdate({ _id: id }, { $set: { name, categoryIds, amount, timeFrame, startDate, endDate } }, { returnDocument: 'after' });
            if (savedData) {
                const data = {
                    ...savedData.toObject({ versionKey: false }),
                    categories
                }
                res.status(200).json({ message: 'Transaction updated successfully', data: data });
            } else {
                res.status(400).json({ message: 'Unable to update transaction' });
            }
        } else {

            const savedData = new budget({ userId, name, categoryIds, amount, timeFrame, startDate, endDate });
            await savedData.save();
            const data = {
                ...savedData.toObject({ versionKey: false }),
                categories
            }
            res.status(200).json({ message: 'Budget added successfully', data: data });

        }
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const fetchBudget = async (req, res) => {
    try {
        const userId = req.userId;
        const search = req.query.search || '';
        const limit = Number(req.query.perPage);
        const skip = req.query.page ? req.query.page * limit : 0;

        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }
        let match = {}
        if (userId) {
            match.userId = new mongoose.Types.ObjectId(userId)
        }

        if (search) {
            match.name = { $regex: search, $options: "i" }
        }

        const result = await budget.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryIds",
                    foreignField: "_id",
                    as: "categories"
                }
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "categoryIds",
                    foreignField: "categoryId",
                    as: "transactions"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    amount: 1,
                    timeFrame: 1,
                    startDate: 1,
                    endDate: 1,
                    categories: {
                        "_id": 1,
                        "name": 1,
                        "categoryType": 1,
                        "color": 1,
                    },
                    transactions: 1,
                    spent: { $sum: "$transactions.amount" }
                }
            }
        ]);
        res.status(200).json({ message: 'Budget fetch successfully', data: result });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteBudget = async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;

        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        const BudgetData = await budget.findOne({ _id: id, userId });

        if (!BudgetData) {
            return res.status(400).json({ message: 'Budget not found.' });
        }
        const isDeleted = await budget.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) });

        if (isDeleted) {
            res.status(200).json({ message: 'Budget deleted successfully' });
        } else {
            res.status(400).json({ message: 'Unable to delete budget.' });
        }
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}