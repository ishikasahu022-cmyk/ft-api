export const registerValidation = (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const requirData = [];
        !name && requirData.push('Name');
        !email && requirData.push('Email');
        !password && requirData.push('Password');

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

export const loginValidation = (req, res, next) => {
    try {
        const { email, password } = req.body;

        const requirData = [];
        !email && requirData.push('Email');
        !password && requirData.push('Password');

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

export const otpValidation = (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const requirData = [];
        !email && requirData.push('Email');
        !otp && requirData.push('Otp');

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