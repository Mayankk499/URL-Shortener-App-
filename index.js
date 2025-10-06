import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({status: 'Server is up & running'});
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})
