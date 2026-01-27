export interface AllArticles {
    id: string
    articleTitle: string
    articleSummary: string
    articleContent: string
    imagePath: string
    createdDate: Date
    updatedDate: Date
    isPublished: boolean
    facebook: boolean
    twitter: boolean
    editorChoice?: boolean
    categoryId: number
    tagId: number
    tagName: string
    upperArticleId: number
    upperArticleName: string
    podcastTypeId: number
    podcastName: string
}


export interface AllCategories {
    id: number;
    name: string;
    categorySlug: string;
    isActivated: boolean;
    articles?: AllArticles[]; // Optional for backward compatibility
}

export interface Video {
    videoId: number;
    videoTitle: string;
    videoSummary?: string;
    videoLink: string;
    isPublished: boolean;
    createdVideoDate: Date;
    modifiedVideoDate: Date;
    tagId?: number;
    tagName?: string;
}