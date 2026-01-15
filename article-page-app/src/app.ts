import express from 'express';
import { setArticleRoutes } from './routes/articleRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setArticleRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});