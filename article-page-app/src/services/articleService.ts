export class ArticleService {
    private articles: Article[] = [];

    constructor() {
        // Sample data for demonstration purposes
        this.articles = [
            { id: 'guid-1', title: 'First Article', content: 'Content of the first article.', author: 'Author A' },
            { id: 'guid-2', title: 'Second Article', content: 'Content of the second article.', author: 'Author B' },
            { id: 'guid-3', title: 'Third Article', content: 'Content of the third article.', author: 'Author C' },
        ];
    }

    public getArticleByGuid(guid: string): Article | undefined {
        return this.articles.find(article => article.id === guid);
    }

    public getAllArticles(): Article[] {
        return this.articles;
    }
}