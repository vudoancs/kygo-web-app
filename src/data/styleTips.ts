export interface StyleTip {
  id: string;
  title: string;
  titleEn: string;
  titleKo: string;
  excerpt: string;
  excerptEn: string;
  excerptKo: string;
  content: string;
  contentEn: string;
  contentKo: string;
  image: string;
  category: string;
  categoryEn: string;
  categoryKo: string;
  author: string;
  date: string;
  readTime: number; // in minutes
  tags: string[];
  tagsEn: string[];
  tagsKo: string[];
}

export const styleTips: StyleTip[] = [
  {
    id: '1',
    title: 'Cách chọn váy dạ hội phù hợp với dáng người',
    titleEn: 'How to Choose an Evening Gown That Suits Your Body Type',
    titleKo: '체형에 맞는 이브닝 드레스 선택하는 법',
    excerpt: 'Mỗi dáng người đều có những ưu điểm riêng. Hãy cùng khám phá cách chọn váy dạ hội giúp tôn lên vẻ đẹp tự nhiên của bạn.',
    excerptEn: 'Every body type has its own unique beauty. Discover how to choose an evening gown that enhances your natural features.',
    excerptKo: '모든 체형에는 고유한 아름다움이 있습니다. 당신의 자연스러운 특징을 강조하는 이브닝 드레스를 선택하는 방법을 알아보세요.',
    content: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Dáng người quả lê (Triangle)</h2>
      <p class="text-gray-700 leading-relaxed">Đặc điểm: Vai hẹp hơn hông, phần thân trên nhỏ so với phần dưới.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Nên chọn:</strong> Váy có phần vai nổi bật, cổ thuyền, cổ V sâu, hoặc có chi tiết ở phần thân trên để cân bằng tỷ lệ. Váy xòe chữ A giúp che đi phần hông.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Dáng người tam giác ngược (Inverted Triangle)</h2>
      <p class="text-gray-700 leading-relaxed">Đặc điểm: Vai rộng, thân trên lớn, hông và chân thon.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Nên chọn:</strong> Váy có phần dưới xòe, váy đuôi cá để tạo cân bằng. Tránh quá nhiều chi tiết ở vai.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Dáng người chữ nhật (Rectangle)</h2>
      <p class="text-gray-700 leading-relaxed">Đặc điểm: Vai, eo và hông cân đối, không có đường cong rõ rệt.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Nên chọn:</strong> Váy ôm tạo đường cong, váy có thắt eo hoặc chi tiết ở eo để tạo điểm nhấn.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Dáng người đồng hồ cát (Hourglass)</h2>
      <p class="text-gray-700 leading-relaxed">Đặc điểm: Vai và hông cân đối, eo thon rõ rệt.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Nên chọn:</strong> Hầu hết các kiểu váy đều phù hợp! Váy ôm sát giúp tôn dáng tối đa.</p>
    </div>`,
    contentEn: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Pear Shape (Triangle)</h2>
      <p class="text-gray-700 leading-relaxed">Characteristics: Narrower shoulders than hips, smaller upper body compared to lower body.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Choose:</strong> Dresses with prominent shoulders, boat neckline, deep V-neck, or details on the upper body to balance proportions. A-line dresses help conceal the hip area.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Inverted Triangle Shape</h2>
      <p class="text-gray-700 leading-relaxed">Characteristics: Broad shoulders, larger upper body, slim hips and legs.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Choose:</strong> Dresses with flared bottoms, mermaid dresses to create balance. Avoid too many details on shoulders.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Rectangle Shape</h2>
      <p class="text-gray-700 leading-relaxed">Characteristics: Balanced shoulders, waist and hips, no distinct curves.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Choose:</strong> Form-fitting dresses that create curves, dresses with waist details or belts to create focal points.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Hourglass Shape</h2>
      <p class="text-gray-700 leading-relaxed">Characteristics: Balanced shoulders and hips, distinct slim waist.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Choose:</strong> Most dress styles suit you! Body-hugging dresses maximize your figure.</p>
    </div>`,
    contentKo: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">배 모양 체형 (Triangle)</h2>
      <p class="text-gray-700 leading-relaxed">특징: 어깨가 엉덩이보다 좁고, 상체가 하체보다 작습니다.</p>
      <p class="text-gray-700 leading-relaxed"><strong>선택:</strong> 어깨가 돋보이는 드레스, 보트 넥라인, 깊은 V넥, 또는 상체에 디테일이 있는 드레스로 비율을 균형있게 만드세요. A라인 드레스는 엉덩이 부분을 가리는 데 도움이 됩니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">역삼각형 체형</h2>
      <p class="text-gray-700 leading-relaxed">특징: 넓은 어깨, 큰 상체, 날씬한 엉덩이와 다리.</p>
      <p class="text-gray-700 leading-relaxed"><strong>선택:</strong> 하단이 퍼진 드레스, 머메이드 드레스로 균형을 만드세요. 어깨에 너무 많은 디테일은 피하세요.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">직사각형 체형</h2>
      <p class="text-gray-700 leading-relaxed">특징: 어깨, 허리, 엉덩이가 균형잡혀 있고, 뚜렷한 곡선이 없습니다.</p>
      <p class="text-gray-700 leading-relaxed"><strong>선택:</strong> 곡선을 만드는 몸에 맞는 드레스, 허리에 디테일이 있거나 벨트가 있는 드레스로 포인트를 만드세요.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">모래시계 체형</h2>
      <p class="text-gray-700 leading-relaxed">특징: 어깨와 엉덩이가 균형잡혀 있고, 뚜렷한 잘록한 허리.</p>
      <p class="text-gray-700 leading-relaxed"><strong>선택:</strong> 대부분의 드레스 스타일이 잘 어울립니다! 몸에 딱 맞는 드레스가 당신의 몸매를 최대한 살려줍니다.</p>
    </div>`,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
    category: 'Hướng dẫn chọn váy',
    categoryEn: 'Dress Selection Guide',
    categoryKo: '드레스 선택 가이드',
    author: 'Kygo Stylist Team',
    date: '2024-03-15',
    readTime: 5,
    tags: ['Dáng người', 'Chọn váy', 'Tips'],
    tagsEn: ['Body Type', 'Dress Selection', 'Tips'],
    tagsKo: ['체형', '드레스 선택', '팁'],
  },
  {
    id: '2',
    title: 'Phối màu váy dạ hội với phụ kiện thế nào cho hoàn hảo',
    titleEn: 'How to Match Evening Gown Colors with Accessories Perfectly',
    titleKo: '이브닝 드레스 색상과 액세서리를 완벽하게 매치하는 법',
    excerpt: 'Phụ kiện đúng có thể biến một bộ váy dạ hội thành một tuyệt phẩm. Tìm hiểu cách phối màu để tạo nên phong cách ấn tượng.',
    excerptEn: 'The right accessories can transform an evening gown into a masterpiece. Learn how to color coordinate for a stunning look.',
    excerptKo: '올바른 액세서리는 이브닝 드레스를 걸작으로 변화시킬 수 있습니다. 멋진 룩을 위한 색상 조합 방법을 알아보세요.',
    content: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Nguyên tắc vàng khi phối màu</h2>
      <p class="text-gray-700 leading-relaxed">Phối màu phụ kiện với váy dạ hội là một nghệ thuật tinh tế. Có 3 cách phối màu cơ bản:</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">1. Phối màu đồng điệu (Tonal)</h3>
      <p class="text-gray-700 leading-relaxed">Chọn phụ kiện cùng tông màu với váy nhưng có thể khác độ đậm nhạt. Ví dụ: Váy hồng đậm - clutch hồng nhạt.</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">2. Phối màu trung tính</h3>
      <p class="text-gray-700 leading-relaxed">Màu trung tính như vàng, bạc, nude, đen luôn an toàn và sang trọng. Đây là lựa chọn không bao giờ sai.</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">3. Phối màu tương phản</h3>
      <p class="text-gray-700 leading-relaxed">Dành cho những ai muốn nổi bật. Ví dụ: Váy xanh navy - phụ kiện đỏ/vàng gold.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Gợi ý phụ kiện theo màu váy</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li><strong>Váy đỏ/đỏ rượu:</strong> Vàng gold, bạc, đen, nude</li>
        <li><strong>Váy xanh navy:</strong> Bạc, trắng, nude, vàng gold</li>
        <li><strong>Váy đen:</strong> Mọi màu sắc đều phù hợp, đặc biệt là kim loại sáng</li>
        <li><strong>Váy pastel:</strong> Vàng rose gold, bạc, trắng ngọc trai</li>
      </ul>
    </div>`,
    contentEn: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Golden Rules for Color Coordination</h2>
      <p class="text-gray-700 leading-relaxed">Matching accessories with evening gowns is a delicate art. There are 3 basic color coordination methods:</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">1. Tonal Matching</h3>
      <p class="text-gray-700 leading-relaxed">Choose accessories in the same color family as your dress but in different shades. Example: Deep pink dress - light pink clutch.</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">2. Neutral Color Matching</h3>
      <p class="text-gray-700 leading-relaxed">Neutral colors like gold, silver, nude, and black are always safe and elegant. This choice never fails.</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">3. Contrasting Colors</h3>
      <p class="text-gray-700 leading-relaxed">For those who want to stand out. Example: Navy blue dress - red/gold accessories.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Accessory Suggestions by Dress Color</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li><strong>Red/Wine red dress:</strong> Gold, silver, black, nude</li>
        <li><strong>Navy blue dress:</strong> Silver, white, nude, gold</li>
        <li><strong>Black dress:</strong> All colors work, especially bright metallics</li>
        <li><strong>Pastel dress:</strong> Rose gold, silver, pearl white</li>
      </ul>
    </div>`,
    contentKo: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">색상 조합의 황금 법칙</h2>
      <p class="text-gray-700 leading-relaxed">이브닝 드레스와 액세서리를 매치하는 것은 섬세한 예술입니다. 3가지 기본 색상 조합 방법이 있습니다:</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">1. 톤온톤 매칭</h3>
      <p class="text-gray-700 leading-relaxed">드레스와 같은 색상 계열의 액세서리를 선택하되 다른 음영을 선택하세요. 예: 진한 핑크 드레스 - 연한 핑크 클러치.</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">2. 중립 색상 매칭</h3>
      <p class="text-gray-700 leading-relaxed">골드, 실버, 누드, 블랙과 같은 중립 색상은 항상 안전하고 우아합니다. 이 선택은 절대 실패하지 않습니다.</p>
      
      <h3 class="font-semibold text-xl text-gray-900 mt-6 mb-3">3. 대비 색상</h3>
      <p class="text-gray-700 leading-relaxed">돋보이고 싶은 분들을 위한 선택. 예: 네이비 블루 드레스 - 레드/골드 액세서리.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">드레스 색상별 액세서리 제안</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li><strong>레드/와인 레드 드레스:</strong> 골드, 실버, 블랙, 누드</li>
        <li><strong>네이비 블루 드레스:</strong> 실버, 화이트, 누드, 골드</li>
        <li><strong>블랙 드레스:</strong> 모든 색상 가능, 특히 밝은 메탈릭</li>
        <li><strong>파스텔 드레스:</strong> 로즈 골드, 실버, 펄 화이트</li>
      </ul>
    </div>`,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
    category: 'Phối đồ',
    categoryEn: 'Styling',
    categoryKo: '스타일링',
    author: 'Kygo Stylist Team',
    date: '2024-03-20',
    readTime: 4,
    tags: ['Phối màu', 'Phụ kiện', 'Thời trang'],
    tagsEn: ['Color Matching', 'Accessories', 'Fashion'],
    tagsKo: ['색상 매칭', '액세서리', '패션'],
  },
  {
    id: '3',
    title: 'Xu hướng váy dạ hội 2024: Những gì bạn cần biết',
    titleEn: 'Evening Gown Trends 2024: What You Need to Know',
    titleKo: '2024 이브닝 드레스 트렌드: 알아야 할 것들',
    excerpt: 'Cập nhật ngay những xu hướng váy dạ hội hot nhất năm 2024 để luôn nổi bật trong mọi sự kiện.',
    excerptEn: 'Stay updated with the hottest evening gown trends of 2024 to stand out at every event.',
    excerptKo: '모든 행사에서 돋보이기 위해 2024년 가장 핫한 이브닝 드레스 트렌드를 확인하세요.',
    content: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">1. Cut-out táo bạo</h2>
      <p class="text-gray-700 leading-relaxed">Những đường cut-out tinh tế ở eo, lưng hoặc vai đang trở thành xu hướng được yêu thích. Vừa gợi cảm vừa thanh lịch.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">2. Màu sắc nổi bật</h2>
      <p class="text-gray-700 leading-relaxed">Tạm biệt những tông màu pastel nhạt nhòa! Năm 2024 là năm của những gam màu rực rỡ như đỏ cherry, xanh cobalt, tím royal.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">3. Sequins và ánh kim</h2>
      <p class="text-gray-700 leading-relaxed">Sequins toàn thân hoặc chi tiết ánh kim lấp lánh giúp bạn tỏa sáng dưới ánh đèn. Hoàn hảo cho các bữa tiệc tối.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">4. Phom dáng oversized</h2>
      <p class="text-gray-700 leading-relaxed">Váy có phom dáng rộng, oversized mang lại cảm giác thoải mái nhưng vẫn vô cùng sang trọng và ấn tượng.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">5. Vải bền vững</h2>
      <p class="text-gray-700 leading-relaxed">Xu hướng thời trang bền vững đang lên ngôi. Các thiết kế từ vải tái chế hoặc organic cotton được ưa chuộng.</p>
    </div>`,
    contentEn: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">1. Bold Cut-outs</h2>
      <p class="text-gray-700 leading-relaxed">Delicate cut-outs at the waist, back, or shoulders are becoming a favorite trend. Both sensual and elegant.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">2. Bold Colors</h2>
      <p class="text-gray-700 leading-relaxed">Goodbye pale pastels! 2024 is the year of vibrant colors like cherry red, cobalt blue, and royal purple.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">3. Sequins and Metallics</h2>
      <p class="text-gray-700 leading-relaxed">Full-body sequins or shimmering metallic details help you shine under the lights. Perfect for evening parties.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">4. Oversized Silhouettes</h2>
      <p class="text-gray-700 leading-relaxed">Dresses with loose, oversized silhouettes offer comfort while remaining extremely elegant and impressive.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">5. Sustainable Fabrics</h2>
      <p class="text-gray-700 leading-relaxed">Sustainable fashion is on the rise. Designs made from recycled fabrics or organic cotton are gaining popularity.</p>
    </div>`,
    contentKo: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">1. 대담한 컷아웃</h2>
      <p class="text-gray-700 leading-relaxed">허리, 등, 어깨의 섬세한 컷아웃이 인기 트렌드가 되고 있습니다. 관능적이면서도 우아합니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">2. 대담한 색상</h2>
      <p class="text-gray-700 leading-relaxed">연한 파스텔에 작별을! 2024년은 체리 레드, 코발트 블루, 로얄 퍼플과 같은 생생한 색상의 해입니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">3. 스팽글과 메탈릭</h2>
      <p class="text-gray-700 leading-relaxed">전신 스팽글이나 반짝이는 메탈릭 디테일이 조명 아래에서 빛나게 합니다. 저녁 파티에 완벽합니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">4. 오버사이즈 실루엣</h2>
      <p class="text-gray-700 leading-relaxed">느슨하고 오버사이즈한 실루엣의 드레스는 편안함을 제공하면서도 매우 우아하고 인상적입니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">5. 지속 가능한 원단</h2>
      <p class="text-gray-700 leading-relaxed">지속 가능한 패션이 부상하고 있습니다. 재활용 원단이나 유기농 면으로 만든 디자인이 인기를 얻고 있습니다.</p>
    </div>`,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=600&fit=crop',
    category: 'Xu hướng',
    categoryEn: 'Trends',
    categoryKo: '트렌드',
    author: 'Kygo Stylist Team',
    date: '2024-03-25',
    readTime: 6,
    tags: ['Xu hướng', '2024', 'Thời trang'],
    tagsEn: ['Trends', '2024', 'Fashion'],
    tagsKo: ['트렌드', '2024', '패션'],
  },
  {
    id: '4',
    title: 'Bí quyết giữ váy dạ hội luôn như mới',
    titleEn: 'Secrets to Keeping Your Evening Gown Like New',
    titleKo: '이브닝 드레스를 새것처럼 유지하는 비결',
    excerpt: 'Váy dạ hội là món đồ đắt tiền và quý giá. Học cách bảo quản đúng cách để váy luôn giữ được vẻ đẹp ban đầu.',
    excerptEn: 'Evening gowns are expensive and precious items. Learn proper care techniques to maintain their original beauty.',
    excerptKo: '이브닝 드레스는 비싸고 소중한 아이템입니다. 원래의 아름다움을 유지하기 위한 적절한 관리 기술을 배우세요.',
    content: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Bảo quản sau khi sử dụng</h2>
      <p class="text-gray-700 leading-relaxed">Ngay sau khi sử dụng, hãy treo váy lên móc áo để thoáng khí. Tránh gấp váy ngay lập tức vì có thể tạo nếp nhăn khó xử lý.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Giặt và vệ sinh</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Luôn kiểm tra nhãn hướng dẫn giặt trên váy</li>
        <li>Váy cao cấp nên mang đến tiệm giặt khô chuyên nghiệp</li>
        <li>Không giặt máy với váy có sequins, ren hoặc chi tiết phức tạp</li>
        <li>Sử dụng túi giặt nếu phải giặt máy</li>
      </ul>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Cất giữ đúng cách</h2>
      <p class="text-gray-700 leading-relaxed">Sử dụng móc áo bọc vải để tránh làm hỏng vai váy. Bọc váy trong túi vải thoáng khí, tránh sử dụng túi nilon.</p>
      <p class="text-gray-700 leading-relaxed">Cất váy ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Xử lý vết bẩn</h2>
      <p class="text-gray-700 leading-relaxed">Không cọ mạnh vào vết bẩn. Sử dụng khăn ẩm thấm nhẹ nhàng và đưa đến tiệm giặt khô sớm nhất có thể.</p>
    </div>`,
    contentEn: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Storage After Use</h2>
      <p class="text-gray-700 leading-relaxed">Immediately after use, hang the dress on a hanger to air out. Avoid folding immediately as it may create difficult-to-remove wrinkles.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Washing and Cleaning</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Always check the care label on the dress</li>
        <li>High-end dresses should be taken to professional dry cleaners</li>
        <li>Do not machine wash dresses with sequins, lace, or intricate details</li>
        <li>Use a garment bag if machine washing is necessary</li>
      </ul>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Proper Storage</h2>
      <p class="text-gray-700 leading-relaxed">Use padded hangers to avoid damaging the dress shoulders. Cover dress in breathable fabric bags, avoid plastic bags.</p>
      <p class="text-gray-700 leading-relaxed">Store dress in a dry, cool place away from direct sunlight.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Stain Treatment</h2>
      <p class="text-gray-700 leading-relaxed">Do not rub stains vigorously. Use a damp cloth to gently blot and take to dry cleaners as soon as possible.</p>
    </div>`,
    contentKo: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">사용 후 보관</h2>
      <p class="text-gray-700 leading-relaxed">사용 직후 드레스를 옷걸이에 걸어 환기시키세요. 제거하기 어려운 주름이 생길 수 있으므로 즉시 접지 마세요.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">세탁 및 청소</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>항상 드레스의 세탁 라벨을 확인하세요</li>
        <li>고급 드레스는 전문 드라이클리닝점에 맡기세요</li>
        <li>스팽글, 레이스 또는 복잡한 디테일이 있는 드레스는 세탁기로 세탁하지 마세요</li>
        <li>세탁기 사용이 필요한 경우 세탁 가방을 사용하세요</li>
      </ul>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">적절한 보관</h2>
      <p class="text-gray-700 leading-relaxed">드레스 어깨가 손상되지 않도록 패딩 처리된 옷걸이를 사용하세요. 통기성 있는 천 가방으로 드레스를 덮고 비닐봉지는 피하세요.</p>
      <p class="text-gray-700 leading-relaxed">직사광선을 피해 건조하고 시원한 곳에 드레스를 보관하세요.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">얼룩 제거</h2>
      <p class="text-gray-700 leading-relaxed">얼룩을 세게 문지르지 마세요. 젖은 천으로 부드럽게 두드리고 가능한 한 빨리 드라이클리닝점에 가져가세요.</p>
    </div>`,
    image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=600&fit=crop',
    category: 'Chăm sóc váy',
    categoryEn: 'Dress Care',
    categoryKo: '드레스 관리',
    author: 'Kygo Stylist Team',
    date: '2024-03-28',
    readTime: 5,
    tags: ['Bảo quản', 'Chăm sóc', 'Tips'],
    tagsEn: ['Maintenance', 'Care', 'Tips'],
    tagsKo: ['유지관리', '관리', '팁'],
  },
  {
    id: '5',
    title: 'Makeup và tóc phù hợp với từng kiểu váy dạ hội',
    titleEn: 'Makeup and Hairstyles for Different Evening Gown Styles',
    titleKo: '이브닝 드레스 스타일별 메이크업과 헤어스타일',
    excerpt: 'Trang điểm và kiểu tóc phải hài hòa với váy dạ hội để tạo nên tổng thể hoàn hảo. Cùng khám phá bí quyết phối hợp.',
    excerptEn: 'Makeup and hairstyles must harmonize with your evening gown for a perfect overall look. Discover coordination secrets.',
    excerptKo: '메이크업과 헤어스타일은 완벽한 전체적인 룩을 위해 이브닝 드레스와 조화를 이루어야 합니다. 조합의 비밀을 발견하세요.',
    content: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Váy cổ V hoặc cổ yếm</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Tập trung vào mắt với eyeliner sắc nét và mascara dày. Môi có thể nhẹ nhàng.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Tóc:</strong> Búi cao hoặc tóc xõa dài để làm nổi bật đường cổ.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Váy cổ cao kín đáo</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Trang điểm môi nổi bật với màu đỏ hoặc hồng đậm. Mắt nhẹ nhàng hơn.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Tóc:</strong> Tóc búi thấp hoặc tóc xõa một bên vai.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Váy hai dây hoặc strapless</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Cân bằng giữa mắt và môi. Có thể táo bạo hơn vì phần vai cổ để trống.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Tóc:</strong> Búi cao cổ điển, tóc uốn xõa bồng bềnh hoặc kiểu tóc side-swept.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Váy có chi tiết phức tạp</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Giữ trang điểm đơn giản, tự nhiên để không lấn át váy.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Tóc:</strong> Kiểu tóc đơn giản, gọn gàng như búi thấp hoặc tóc thẳng xõa.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Lưu ý chung</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Màu sắc makeup nên hài hòa với tone màu của váy</li>
        <li>Không nên quá rườm rà cả tóc lẫn makeup</li>
        <li>Xịt khoáng và phấn phủ để makeup bền lâu suốt đêm</li>
      </ul>
    </div>`,
    contentEn: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">V-neck or Halter Neck Dress</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Focus on eyes with sharp eyeliner and thick mascara. Lips can be subtle.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Hair:</strong> High bun or long flowing hair to highlight the neckline.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">High Neck Conservative Dress</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Bold lip makeup with red or deep pink. Lighter eye makeup.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Hair:</strong> Low bun or hair swept to one side.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Spaghetti Strap or Strapless Dress</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Balance between eyes and lips. Can be bolder since shoulder area is bare.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Hair:</strong> Classic high bun, voluminous curls, or side-swept style.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Dress with Intricate Details</h2>
      <p class="text-gray-700 leading-relaxed"><strong>Makeup:</strong> Keep makeup simple and natural to not overshadow the dress.</p>
      <p class="text-gray-700 leading-relaxed"><strong>Hair:</strong> Simple, neat hairstyles like low bun or straight flowing hair.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">General Notes</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Makeup colors should harmonize with dress tone</li>
        <li>Don't overdo both hair and makeup</li>
        <li>Use setting spray and powder for long-lasting makeup throughout the night</li>
      </ul>
    </div>`,
    contentKo: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">V넥 또는 홀터넥 드레스</h2>
      <p class="text-gray-700 leading-relaxed"><strong>메이크업:</strong> 선명한 아이라이너와 진한 마스카라로 눈에 집중하세요. 입술은 은은하게.</p>
      <p class="text-gray-700 leading-relaxed"><strong>헤어:</strong> 목선을 강조하기 위해 높은 업스타일이나 긴 생머리.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">하이넥 보수적인 드레스</h2>
      <p class="text-gray-700 leading-relaxed"><strong>메이크업:</strong> 레드나 진한 핑크로 입술 메이크업을 강조. 눈 메이크업은 가볍게.</p>
      <p class="text-gray-700 leading-relaxed"><strong>헤어:</strong> 낮은 업스타일이나 한쪽 어깨로 넘긴 헤어.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">스파게티 스트랩 또는 스트랩리스 드레스</h2>
      <p class="text-gray-700 leading-relaxed"><strong>메이크업:</strong> 눈과 입술의 균형을 맞추세요. 어깨가 드러나므로 더 대담하게 할 수 있습니다.</p>
      <p class="text-gray-700 leading-relaxed"><strong>헤어:</strong> 클래식한 높은 업스타일, 볼륨감 있는 컬, 또는 사이드 스윕 스타일.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">복잡한 디테일이 있는 드레스</h2>
      <p class="text-gray-700 leading-relaxed"><strong>메이크업:</strong> 드레스를 압도하지 않도록 메이크업을 심플하고 자연스럽게 유지하세요.</p>
      <p class="text-gray-700 leading-relaxed"><strong>헤어:</strong> 낮은 업스타일이나 스트레이트 생머리 같은 심플하고 깔끔한 헤어스타일.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">일반적인 주의사항</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>메이크업 색상은 드레스 톤과 조화를 이루어야 합니다</li>
        <li>헤어와 메이크업 모두 과하게 하지 마세요</li>
        <li>밤새 오래가는 메이크업을 위해 세팅 스프레이와 파우더를 사용하세요</li>
      </ul>
    </div>`,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
    category: 'Làm đẹp',
    categoryEn: 'Beauty',
    categoryKo: '뷰티',
    author: 'Kygo Stylist Team',
    date: '2024-03-30',
    readTime: 7,
    tags: ['Makeup', 'Tóc', 'Làm đẹp'],
    tagsEn: ['Makeup', 'Hair', 'Beauty'],
    tagsKo: ['메이크업', '헤어', '뷰티'],
  },
  {
    id: '6',
    title: 'Lựa chọn giày phù hợp với váy dạ hội',
    titleEn: 'Choosing the Right Shoes for Your Evening Gown',
    titleKo: '이브닝 드레스에 맞는 신발 선택하기',
    excerpt: 'Đôi giày đúng có thể nâng tầm toàn bộ outfit. Hãy cùng tìm hiểu cách chọn giày phù hợp với từng loại váy.',
    excerptEn: 'The right pair of shoes can elevate your entire outfit. Learn how to choose shoes that match each dress style.',
    excerptKo: '올바른 신발은 전체 의상을 한 단계 높일 수 있습니다. 각 드레스 스타일에 맞는 신발을 선택하는 방법을 배우세요.',
    content: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Váy dài chạm sàn</h2>
      <p class="text-gray-700 leading-relaxed">Vì giày sẽ ít được nhìn thấy, hãy ưu tiên sự thoải mái. Giày cao gót 7-10cm là lý tưởng. Màu sắc nên trung tính như nude, bạc hoặc vàng.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Váy midi (dài quá gối)</h2>
      <p class="text-gray-700 leading-relaxed">Giày sẽ được nhìn thấy rõ! Chọn giày cao gót thanh mảnh với chi tiết tinh tế. Giày ankle strap hoặc sandal cao gót đều phù hợp.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Váy ngắn (mini/cocktail)</h2>
      <p class="text-gray-700 leading-relaxed">Đây là lúc để thể hiện! Giày cao gót nổi bật, có thể có màu sắc rực rỡ hoặc chi tiết sequins, kim loại.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Tips chung khi chọn giày</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Luôn thử giày và đi thử trước sự kiện</li>
        <li>Chuẩn bị một đôi giày dự phòng thoải mái hơn</li>
        <li>Giày nude giúp chân dài hơn</li>
        <li>Kiểu dáng pointed toe sang trọng hơn round toe</li>
        <li>Độ cao gót phụ thuộc vào chiều cao váy và khả năng di chuyển của bạn</li>
      </ul>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Màu sắc phối hợp</h2>
      <p class="text-gray-700 leading-relaxed">Với váy màu tối: Giày bạc, vàng gold hoặc cùng màu với váy.<br>
      Với váy màu sáng: Giày nude, pastel hoặc metallic.<br>
      Với váy có họa tiết: Giày trơn màu trung tính.</p>
    </div>`,
    contentEn: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">Floor-length Gowns</h2>
      <p class="text-gray-700 leading-relaxed">Since shoes will be less visible, prioritize comfort. Heels 7-10cm are ideal. Colors should be neutral like nude, silver, or gold.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Midi Dress (Below Knee)</h2>
      <p class="text-gray-700 leading-relaxed">Shoes will be visible! Choose slender heels with delicate details. Ankle strap heels or high-heeled sandals work well.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Short Dress (Mini/Cocktail)</h2>
      <p class="text-gray-700 leading-relaxed">Time to make a statement! Bold heels with vibrant colors or sequin/metallic details.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">General Shoe Selection Tips</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>Always try on and walk in shoes before the event</li>
        <li>Prepare a more comfortable backup pair</li>
        <li>Nude shoes make legs appear longer</li>
        <li>Pointed toe styles are more elegant than round toe</li>
        <li>Heel height depends on dress length and your mobility</li>
      </ul>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">Color Coordination</h2>
      <p class="text-gray-700 leading-relaxed">With dark dresses: Silver, gold shoes or same color as dress.<br>
      With light dresses: Nude, pastel, or metallic shoes.<br>
      With patterned dresses: Plain neutral-colored shoes.</p>
    </div>`,
    contentKo: `<div class="space-y-6">
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4">바닥까지 닿는 롱 드레스</h2>
      <p class="text-gray-700 leading-relaxed">신발이 덜 보이므로 편안함을 우선시하세요. 7-10cm 힐이 이상적입니다. 색상은 누드, 실버 또는 골드와 같은 중립색이어야 합니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">미디 드레스 (무릎 아래)</h2>
      <p class="text-gray-700 leading-relaxed">신발이 보입니다! 섬세한 디테일의 슬림한 힐을 선택하세요. 앵클 스트랩 힐이나 하이힐 샌들이 잘 어울립니다.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">짧은 드레스 (미니/칵테일)</h2>
      <p class="text-gray-700 leading-relaxed">포인트를 줄 시간입니다! 생생한 색상이나 스팽글/메탈릭 디테일이 있는 대담한 힐.</p>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">일반적인 신발 선택 팁</h2>
      <ul class="list-disc pl-6 space-y-2 text-gray-700">
        <li>행사 전에 항상 신발을 신어보고 걸어보세요</li>
        <li>더 편안한 예비 신발을 준비하세요</li>
        <li>누드 신발은 다리를 더 길어 보이게 합니다</li>
        <li>뾰족한 토 스타일이 둥근 토보다 더 우아합니다</li>
        <li>힐 높이는 드레스 길이와 이동성에 따라 다릅니다</li>
      </ul>
      
      <h2 class="font-serif text-2xl font-bold text-gray-900 mb-4 mt-8">색상 조합</h2>
      <p class="text-gray-700 leading-relaxed">어두운 드레스: 실버, 골드 신발 또는 드레스와 같은 색상.<br>
      밝은 드레스: 누드, 파스텔 또는 메탈릭 신발.<br>
      패턴이 있는 드레스: 무지 중립색 신발.</p>
    </div>`,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop',
    category: 'Phối đồ',
    categoryEn: 'Styling',
    categoryKo: '스타일링',
    author: 'Kygo Stylist Team',
    date: '2024-04-02',
    readTime: 5,
    tags: ['Giày', 'Phối đồ', 'Phụ kiện'],
    tagsEn: ['Shoes', 'Styling', 'Accessories'],
    tagsKo: ['신발', '스타일링', '액세서리'],
  },
];
