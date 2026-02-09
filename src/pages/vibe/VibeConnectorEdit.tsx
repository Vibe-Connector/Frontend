import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonOrange } from '@/components/common';

// --- Types ---
interface VibeItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  thumbnailUrl: string;
  position: { top: string; left: string };
  link?: string;
}

// --- Mock Data ---
const MOCK_VIBE_IMAGE = 'https://picsum.photos/seed/viberoom/800/900';

const MOCK_ITEMS: VibeItem[] = [
  {
    id: 'item-1',
    name: 'Vintage Sofa',
    category: 'Furniture',
    brand: 'HAY',
    description: '따뜻한 테라코타 컬러의 라운드 소파. 부드러운 패브릭 소재로 편안한 착석감을 제공합니다.',
    thumbnailUrl: 'https://picsum.photos/seed/sofa1/200/200',
    position: { top: '45%', left: '15%' },
    link: 'https://example.com/sofa',
  },
  {
    id: 'item-2',
    name: 'Mushroom Lamp',
    category: 'Lighting',
    brand: 'Gubi',
    description: '미드센추리 무드의 머쉬룸 테이블 램프. 은은한 조명으로 감성적인 분위기를 연출합니다.',
    thumbnailUrl: 'https://picsum.photos/seed/lamp1/200/200',
    position: { top: '38%', left: '8%' },
  },
  {
    id: 'item-3',
    name: 'Round Coffee Table',
    category: 'Furniture',
    brand: 'Knoll',
    description: '블랙 베이스에 화이트 마블 상판의 라운드 커피 테이블. 공간의 중심을 잡아줍니다.',
    thumbnailUrl: 'https://picsum.photos/seed/table1/200/200',
    position: { top: '72%', left: '45%' },
  },
  {
    id: 'item-4',
    name: 'Wood Room Divider',
    category: 'Decor',
    brand: 'Muji',
    description: '내추럴 우드 파티션. 공간을 자연스럽게 분리하며 따뜻한 질감을 더합니다.',
    thumbnailUrl: 'https://picsum.photos/seed/divider1/200/200',
    position: { top: '25%', left: '42%' },
  },
  {
    id: 'item-5',
    name: 'Indoor Plant Set',
    category: 'Plant',
    brand: 'Greenery',
    description: '다양한 크기의 실내 식물 세트. 공간에 생기와 자연스러운 포인트를 더합니다.',
    thumbnailUrl: 'https://picsum.photos/seed/plant1/200/200',
    position: { top: '30%', left: '55%' },
  },
  {
    id: 'item-6',
    name: 'Woven Area Rug',
    category: 'Textile',
    brand: 'IKEA',
    description: '기하학 패턴의 우븐 러그. 바닥에 따뜻한 질감과 리듬감을 부여합니다.',
    thumbnailUrl: 'https://picsum.photos/seed/rug1/200/200',
    position: { top: '82%', left: '30%' },
  },
  {
    id: 'item-7',
    name: 'Wall Art Frame',
    category: 'Decor',
    brand: 'Desenio',
    description: '컬러 팔레트 아트 프린트. 벽면에 감각적인 포인트를 만들어줍니다.',
    thumbnailUrl: 'https://picsum.photos/seed/art1/200/200',
    position: { top: '18%', left: '20%' },
  },
  {
    id: 'item-8',
    name: 'Ceramic Vase',
    category: 'Decor',
    brand: 'Zara Home',
    description: '핸드메이드 세라믹 화병. 미니멀한 형태로 어느 공간에나 어울립니다.',
    thumbnailUrl: 'https://picsum.photos/seed/vase1/200/200',
    position: { top: '55%', left: '70%' },
  },
];

// --- Icons ---
function PlusMarker({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
        isActive
          ? 'scale-125 border-blue bg-blue text-white'
          : 'border-blue bg-white/80 text-blue hover:scale-110 hover:bg-blue hover:text-white'
      }`}
      aria-label="아이템 보기"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="6" y1="2" x2="6" y2="10" />
        <line x1="2" y1="6" x2="10" y2="6" />
      </svg>
    </button>
  );
}

// --- Sub Components ---
function VibeImage({
  items,
  selectedId,
  onMarkerClick,
}: {
  items: VibeItem[];
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-card">
      <img
        src={MOCK_VIBE_IMAGE}
        alt="Vibe 이미지"
        className="h-auto w-full object-cover"
        style={{ aspectRatio: '4 / 5' }}
      />
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{ top: item.position.top, left: item.position.left }}
        >
          <PlusMarker
            isActive={selectedId === item.id}
            onClick={() => onMarkerClick(item.id)}
          />
        </div>
      ))}
    </div>
  );
}

function ItemThumbnail({
  item,
  isSelected,
  onClick,
}: {
  item: VibeItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative aspect-square w-full cursor-pointer overflow-hidden rounded-card border-2 bg-white transition-all duration-200 ${
        isSelected
          ? 'border-blue shadow-card'
          : 'border-transparent hover:border-stroke'
      }`}
    >
      <img
        src={item.thumbnailUrl}
        alt={item.name}
        className="h-full w-full object-cover p-2 transition-transform duration-200 group-hover:scale-105"
        style={{ borderRadius: '12px' }}
        loading="lazy"
      />
    </button>
  );
}

function ItemGrid({
  items,
  selectedId,
  onItemClick,
}: {
  items: VibeItem[];
  selectedId: string | null;
  onItemClick: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <ItemThumbnail
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </div>
  );
}

function ItemDetail({ item }: { item: VibeItem | null }) {
  if (!item) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-card bg-[#D5C8C3]/40">
        <p className="text-[14px] text-caption">
          아이템을 선택하면 상세 정보가 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[300px] flex-col rounded-card bg-[#D5C8C3]/40 p-5">
      <div className="mb-4 overflow-hidden rounded-card">
        <img
          src={item.thumbnailUrl}
          alt={item.name}
          className="aspect-square w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-[12px] font-medium text-caption">
          {item.category}
        </span>
        <h3 className="text-[18px] font-bold text-high-emphasis">
          {item.name}
        </h3>
        <p className="mt-1 text-[13px] font-medium text-low-emphasis">
          {item.brand}
        </p>
        <p className="mt-3 flex-1 text-[13px] leading-[1.6] text-caption">
          {item.description}
        </p>
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-blue transition-opacity hover:opacity-70"
          >
            제품 보러가기
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function VibeConnectorEdit() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem =
    MOCK_ITEMS.find((item) => item.id === selectedItemId) ?? null;

  const handleSelectItem = (id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
  };

  return (
    <PageContainer>
      <div className="flex gap-6">
        {/* Left — Vibe Image */}
        <div className="w-[45%] shrink-0">
          <VibeImage
            items={MOCK_ITEMS}
            selectedId={selectedItemId}
            onMarkerClick={handleSelectItem}
          />
        </div>

        {/* Right — Item Panel */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 gap-4 rounded-card bg-surface p-4">
            {/* Item Grid */}
            <div className="w-[60%] shrink-0">
              <ItemGrid
                items={MOCK_ITEMS}
                selectedId={selectedItemId}
                onItemClick={handleSelectItem}
              />
            </div>

            {/* Item Detail */}
            <div className="flex-1">
              <ItemDetail item={selectedItem} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <ButtonOrange
              shape="rect"
              className="!bg-disabled !text-high-emphasis !px-12 !py-4 !text-[16px] !font-bold"
              onClick={handleCancel}
            >
              CANCEL
            </ButtonOrange>
            <ButtonOrange
              shape="rect"
              className="!bg-disabled !text-high-emphasis !px-12 !py-4 !text-[16px] !font-bold"
              onClick={handleSave}
            >
              SAVE
            </ButtonOrange>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
