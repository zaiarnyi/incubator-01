import express, {Request, Response} from 'express';

const port = process.env.PORT || 3000
const parseMiddleware = express.json();

const app = express();
app.use(parseMiddleware);

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
