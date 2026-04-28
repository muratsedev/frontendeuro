import OpinionsGrid from '../../components/OpinionsGrid';

export const metadata = {
  title: 'المقالات',
};

export default function OpinionsPage() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Page header */}
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">المقالات</h1>
        <div className="flex-1 h-0.5 mx-4 bg-primaryOther rounded-sm" />
      </div>

      <OpinionsGrid />
    </div>
  );
}
