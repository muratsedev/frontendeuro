import { Router } from 'express';
import { ArticleComponent } from '../components/ArticleComponent';

const router = Router();
const articleComponent = new ArticleComponent();

export function setArticleRoutes(app) {
    router.get('/articles/:guid', async (req, res) => {
        const guid = req.params.guid;
        try {
            const article = await articleComponent.fetchArticle(guid);
            if (article) {
                res.status(200).json(article);
            } else {
                res.status(404).send('Article not found');
            }
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    });

    app.use('/api', router);
}