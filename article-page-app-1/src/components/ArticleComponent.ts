class ArticleComponent {
    constructor(private articleService: ArticleService) {}

    async fetchArticle(guid: string) {
        const article = await this.articleService.getArticleByGuid(guid);
        return article;
    }

    render(article: Article) {
        if (!article) {
            return '<h1>Article not found</h1>';
        }
        return `
            <div>
                <h1>${article.title}</h1>
                <p>${article.content}</p>
                <p><em>By ${article.author}</em></p>
            </div>
        `;
    }
}

export default ArticleComponent;