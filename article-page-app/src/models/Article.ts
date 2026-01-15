export class Article {
    id: string;
    title: string;
    content: string;
    author: string;

    constructor(id: string, title: string, content: string, author: string) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
}