import ArticlesList from "../../components/ArticlesList";

const ArticlesPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-right">جميع المقالات</h1>
      
      <ArticlesList
        variant="default"
        showImage={true}
      />
    </div>
  );
};

export default ArticlesPage;
