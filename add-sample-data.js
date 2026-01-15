// Script to add sample articles to the database
const BASE_URL = 'https://localhost:7065';

const sampleArticles = [
    {
        ArticleTitle: "أحدث الأخبار السياسية اليوم",
        ArticleSummary: "ملخص موجز عن الأحداث السياسية المهمة التي جرت اليوم في المنطقة والعالم",
        ArticleContent: "محتوى مفصل للمقال السياسي يشمل تحليلاً شاملاً للأوضاع السياسية الحالية والتطورات الجديدة في المشهد السياسي. يتناول هذا المقال أهم القضايا المطروحة على الساحة السياسية ويقدم رؤية شاملة للأحداث الجارية.",
        ImagePath: "/img/1.jpg",
        IsPublished: true,
        CategoryId: 1
    },
    {
        ArticleTitle: "نتائج المباريات الرياضية الأسبوعية",
        ArticleSummary: "تقرير شامل عن نتائج أهم المباريات الرياضية التي جرت هذا الأسبوع",
        ArticleContent: "تفاصيل المباريات والنتائج مع تحليل الأداء والإحصائيات المفصلة للفرق المشاركة. يشمل التقرير أبرز الأحداث الرياضية ونتائج المباريات في مختلف الألعاب الرياضية.",
        ImagePath: "/img/2.jpg",
        IsPublished: true,
        CategoryId: 2
    },
    {
        ArticleTitle: "أخبار متنوعة من حول العالم",
        ArticleSummary: "مجموعة من الأخبار المتنوعة والشيقة من مختلف أنحاء العالم",
        ArticleContent: "تشكيلة متنوعة من الأخبار تشمل الثقافة والفن والتكنولوجيا والعلوم من مختلف دول العالم. يقدم هذا المقال نظرة شاملة على آخر التطورات في هذه المجالات المختلفة.",
        ImagePath: "/img/3.jpg",
        IsPublished: true,
        CategoryId: 3
    },
    {
        ArticleTitle: "تطورات الأمن الإقليمي الجديدة",
        ArticleSummary: "آخر المستجدات في ملف الأمن الإقليمي والتطورات الأمنية المهمة",
        ArticleContent: "تحليل معمق للوضع الأمني في المنطقة والتحديات الراهنة التي تواجه الأمن الإقليمي. يستعرض المقال أحدث التطورات الأمنية والاستراتيجيات المتبعة لمواجهة التحديات الأمنية.",
        ImagePath: "/img/4.jpg",
        IsPublished: true,
        CategoryId: 1
    },
    {
        ArticleTitle: "بطولة كرة القدم المحلية",
        ArticleSummary: "تغطية شاملة لفعاليات بطولة كرة القدم المحلية وأبرز أحداثها",
        ArticleContent: "تقرير مفصل عن مجريات البطولة والفرق المشاركة والنتائج والإحصائيات. يشمل التقرير تحليلاً فنياً للمباريات وأداء اللاعبين والتكتيكات المستخدمة من قبل المدربين.",
        ImagePath: "/img/5.jpg",
        IsPublished: true,
        CategoryId: 2
    },
    {
        ArticleTitle: "اكتشافات علمية جديدة",
        ArticleSummary: "أحدث الاكتشافات العلمية والتقنية في مختلف المجالات",
        ArticleContent: "استعراض لأحدث الاكتشافات العلمية والتقنيات الجديدة التي تؤثر على حياتنا اليومية. يتناول المقال أهم الإنجازات العلمية والابتكارات التي تشهدها مختلف القطاعات.",
        ImagePath: "/img/AdvertiseWithUs.jpg",
        IsPublished: true,
        CategoryId: 3
    }
];

async function addSampleArticles() {
    console.log('بدء إضافة المقالات التجريبية...');
    
    for (let i = 0; i < sampleArticles.length; i++) {
        const article = sampleArticles[i];
        try {
            console.log(`إضافة المقال ${i + 1}: ${article.ArticleTitle}`);
            
            const response = await fetch(`${BASE_URL}/api/Articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✓ تم إضافة المقال بنجاح: ${result.id || 'ID غير محدد'}`);
            } else {
                console.error(`✗ فشل في إضافة المقال: ${response.status} - ${response.statusText}`);
                const errorText = await response.text();
                console.error('تفاصيل الخطأ:', errorText);
            }
        } catch (error) {
            console.error(`خطأ في إضافة المقال ${i + 1}:`, error);
        }
        
        // انتظار قصير بين الطلبات
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('انتهاء إضافة المقالات التجريبية');
}

// تشغيل الدالة
addSampleArticles();
