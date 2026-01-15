export interface ArticleInterface {
    id: string;
    title: string;
    content: string;
    author: string;
}

export interface ArticleResponse {
    article: ArticleInterface;
    message: string;
    success: boolean;
}