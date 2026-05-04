import express from 'express'
import { envConfig } from './config/envConfig.js'
import connectDb from './connectDb.js';
import userRouter from './routes/userRoute.js'
import financeRouter from './routes/financeRouter.js'
import cors from 'cors';
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
connectDb();


app.use('/', userRouter);
app.use('/finance', financeRouter);

app.listen(envConfig.port, () => {
  console.log(`Server is running on http://localhost:${envConfig.port}`)
})