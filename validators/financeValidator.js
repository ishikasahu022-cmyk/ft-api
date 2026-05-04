export const addCategoryValidator = (req, res, next) => {
    try {
        const { name, categoryType, color } = req.body;

        const requirData = [];
        !name && requirData.push('Name');
        !categoryType && requirData.push('Category Type');
        !color && requirData.push('Color');

        if (requirData?.length > 0) {
            res.status(400).json({ message: `${requirData.join(', ')} ${requirData?.length > 1 ? 'is' : 'are'} require` });
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const addTransactionValidator = (req, res, next) => {
    try {
        const { categoryId, amount, date, note } = req.body;

        const requirData = [];
        !categoryId && requirData.push('Category Id');
        !amount && requirData.push('Amount');
        !date && requirData.push('Date');
        !note && requirData.push('Note');

        if (requirData?.length > 0) {
            res.status(400).json({ message: `${requirData.join(', ')} ${requirData?.length > 1 ? 'is' : 'are'} require` });
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

// export const addBudgetValidator = (req, res, next) => {
//     try {
//         const { name, categoryId, amount, timeFrame } = req.body;

//         const requirData = [];
//         !name && requirData.push('Name');
//         if (!categoryId || categoryId?.length == 0) requirData.push('Category');
//         !amount && requirData.push('Amount');
//         !timeFrame && requirData.push('Time Frame');

//         if (requirData?.length > 0) {
//             return res.status(400).json({ message: `${requirData.join(', ')} ${requirData?.length > 1 ? 'is' : 'are'} require` });
//         }
//         next();
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// }


export const addBudgetValidator = (req, res, next) => {
    try {
        const { name, categoryIds, amount,timeFrame } = req.body;

        const requirData = [];
        !name && requirData.push('Name');
        if (!categoryIds || categoryIds?.length == 0) requirData.push('Category');
        !amount && requirData.push('Amount');
        !timeFrame && requirData.push('Time Frame');

        if (requirData?.length > 0) {
            res.status(400).json({ message: `${requirData.join(', ')} ${requirData?.length > 1 ? 'is' : 'are'} require` });
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong' });
    }
}