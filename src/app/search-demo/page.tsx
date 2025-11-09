"use client";
import ArticleSearch from "../../components/ArticleSearch";

export default function SearchDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🔍 تجربة البحث في المقالات
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        مكون البحث الجديد يتيح لك البحث في جميع المقالات بالعنوان والمحتوى، 
                        مع إمكانية ترتيب النتائج حسب تاريخ النشر أو التحديث أو العنوان
                    </p>
                </div>

                {/* Search Component Demo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Search */}
                    <div className="lg:col-span-2">
                        <ArticleSearch 
                            showFilters={true}
                            maxResults={10}
                            className="h-fit"
                        />
                    </div>

                    {/* Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold text-right mb-4 text-gray-800">
                                ✨ مميزات البحث
                            </h3>
                            
                            <div className="space-y-4 text-right">
                                <div className="flex items-start gap-3">
                                    <span className="text-green-500 text-xl">🔍</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">بحث شامل</h4>
                                        <p className="text-sm text-gray-600">
                                            البحث في العناوين والملخصات والمحتوى
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-blue-500 text-xl">⚡</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">بحث سريع</h4>
                                        <p className="text-sm text-gray-600">
                                            نتائج فورية مع تأخير 500ms
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-purple-500 text-xl">📊</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">ترتيب متقدم</h4>
                                        <p className="text-sm text-gray-600">
                                            ترتيب حسب التاريخ أو العنوان
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-orange-500 text-xl">📱</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">تصميم متجاوب</h4>
                                        <p className="text-sm text-gray-600">
                                            يعمل على جميع الأجهزة
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-blue-800 text-right mb-2">
                                    💡 نصائح للبحث
                                </h4>
                                <ul className="text-sm text-blue-700 text-right space-y-1">
                                    <li>• استخدم كلمات مفتاحية واضحة</li>
                                    <li>• جرب البحث بجزء من العنوان</li>
                                    <li>• استخدم خيارات الترتيب للحصول على أفضل النتائج</li>
                                </ul>
                            </div>
                        </div>

                        {/* Usage Example */}
                        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold text-right mb-4 text-gray-800">
                                📝 كيفية الاستخدام
                            </h3>
                            
                            <div className="text-right text-sm text-gray-600 space-y-2">
                                <p><strong>1.</strong> أدخل كلمات البحث في المربع</p>
                                <p><strong>2.</strong> انتظر النتائج (تظهر تلقائياً)</p>
                                <p><strong>3.</strong> استخدم خيارات الترتيب حسب الحاجة</p>
                                <p><strong>4.</strong> اضغط على أي مقال للانتقال إليه</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}