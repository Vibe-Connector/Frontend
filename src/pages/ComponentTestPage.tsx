import { useState } from "react";

// ===== 테스트할 컴포넌트 import =====
import {
  Dropdown,
  Pagination,
  ButtonDefault,
  ButtonPrimary,
  ButtonOrange,
  Modal,
  Alert,
} from "@/components/common";

function ComponentTestPage() {
  // ===== Dropdown 테스트용 상태 =====
  const [dropdownValue, setDropdownValue] = useState("");

  // ===== Pagination 테스트용 상태 =====
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // ===== Modal 테스트용 상태 =====
  const [modalBasic, setModalBasic] = useState(false);
  const [modalIcon, setModalIcon] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [modalCustom, setModalCustom] = useState(false);

  const dropdownOptions = [
    { value: "option1", label: "옵션 1" },
    { value: "option2", label: "옵션 2" },
    { value: "option3", label: "옵션 3" },
    { value: "option4", label: "옵션 4" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-[20px] font-bold tracking-[-1px] text-high-emphasis">
        Component Test Page
      </h1>

      {/* ===== 테스트 영역 시작 ===== */}
      {/* 새 컴포넌트 테스트 시 아래 섹션을 복사하여 사용 */}

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-[18px] font-bold tracking-[-1px] text-high-emphasis">
          Dropdown
        </h2>

        <div className="space-y-6">
          {/* 기본 상태 */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              기본
            </h3>
            <div className="max-w-xs">
              <Dropdown
                options={dropdownOptions}
                value={dropdownValue}
                onChange={setDropdownValue}
                placeholder="옵션을 선택하세요"
              />
            </div>
            <p className="mt-2 text-[13px] text-caption">
              선택된 값: {dropdownValue || "(없음)"}
            </p>
          </div>

          {/* 라벨 있는 상태 */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              라벨 포함
            </h3>
            <div className="max-w-xs">
              <Dropdown
                label="카테고리"
                options={dropdownOptions}
                value={dropdownValue}
                onChange={setDropdownValue}
                placeholder="카테고리 선택"
              />
            </div>
          </div>

          {/* 비활성 상태 */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              비활성화
            </h3>
            <div className="max-w-xs">
              <Dropdown
                label="비활성 드롭다운"
                options={dropdownOptions}
                value="option1"
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-[18px] font-bold tracking-[-1px] text-high-emphasis">
          Pagination
        </h2>

        <div className="space-y-6">
          {/* Square (기본) */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              Square (기본)
            </h3>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="square"
            />
            <p className="mt-2 text-[13px] text-caption">
              현재 페이지: {currentPage} / {totalPages}
            </p>
          </div>

          {/* Circle */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              Circle
            </h3>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="circle"
            />
          </div>

          {/* Text */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              Text
            </h3>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="text"
            />
          </div>

          {/* Minimal */}
          <div>
            <h3 className="mb-2 text-[14px] font-bold tracking-[-1px] text-caption">
              Minimal
            </h3>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="minimal"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-[18px] font-bold tracking-[-1px] text-high-emphasis">
          Buttons
        </h2>

        <div className="space-y-6">
          {/* ButtonDefault */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              ButtonDefault (bg-default)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonDefault>Pill (기본)</ButtonDefault>
              <ButtonDefault shape="rect">Rect</ButtonDefault>
              <ButtonDefault disabled>Disabled</ButtonDefault>
            </div>
          </div>

          {/* ButtonPrimary */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              ButtonPrimary (bg-primary)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonPrimary>Pill (기본)</ButtonPrimary>
              <ButtonPrimary shape="rect">Rect</ButtonPrimary>
              <ButtonPrimary disabled>Disabled</ButtonPrimary>
            </div>
          </div>

          {/* ButtonOrange */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              ButtonOrange (bg-text-primary)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonOrange>Pill (기본)</ButtonOrange>
              <ButtonOrange shape="rect">Rect</ButtonOrange>
              <ButtonOrange disabled>Disabled</ButtonOrange>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-[18px] font-bold tracking-[-1px] text-high-emphasis">
          Modal
        </h2>

        <div className="space-y-6">
          {/* 기본 */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              기본 (title + description + actions)
            </h3>
            <ButtonDefault onClick={() => setModalBasic(true)}>
              기본 Modal 열기
            </ButtonDefault>
            <Modal
              open={modalBasic}
              onClose={() => setModalBasic(false)}
              title="기본 모달"
              description="이것은 기본 모달입니다. 제목과 설명, 버튼이 포함되어 있습니다."
              primaryAction={{
                label: "확인",
                onClick: () => setModalBasic(false),
              }}
              secondaryAction={{
                label: "취소",
                onClick: () => setModalBasic(false),
              }}
            />
          </div>

          {/* 아이콘 포함 */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              아이콘 포함
            </h3>
            <ButtonPrimary onClick={() => setModalIcon(true)}>
              아이콘 Modal 열기
            </ButtonPrimary>
            <Modal
              open={modalIcon}
              onClose={() => setModalIcon(false)}
              icon="🎉"
              title="축하합니다!"
              description="Vibe 생성이 완료되었습니다. 결과를 확인해보세요."
              primaryAction={{
                label: "결과 보기",
                onClick: () => setModalIcon(false),
              }}
            />
          </div>

          {/* 이미지 포함 */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              이미지 포함
            </h3>
            <ButtonOrange onClick={() => setModalImage(true)}>
              이미지 Modal 열기
            </ButtonOrange>
            <Modal
              open={modalImage}
              onClose={() => setModalImage(false)}
              image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
              title="오늘의 Vibe"
              description="따뜻한 카페에서 재즈 음악과 함께하는 오후"
              primaryAction={{
                label: "저장하기",
                onClick: () => setModalImage(false),
              }}
              secondaryAction={{
                label: "공유하기",
                onClick: () => setModalImage(false),
                variant: "outline",
              }}
            />
          </div>

          {/* 커스텀 children */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              커스텀 children (입력 필드)
            </h3>
            <ButtonDefault onClick={() => setModalCustom(true)}>
              커스텀 Modal 열기
            </ButtonDefault>
            <Modal
              open={modalCustom}
              onClose={() => setModalCustom(false)}
              title="폴더 생성"
              description="새 폴더의 이름을 입력해주세요."
              primaryAction={{
                label: "생성",
                onClick: () => setModalCustom(false),
              }}
              secondaryAction={{
                label: "취소",
                onClick: () => setModalCustom(false),
              }}
            >
              <input
                type="text"
                placeholder="폴더 이름"
                className="w-full rounded-lg border border-stroke bg-input px-4 py-3 text-[16px] leading-[24px] tracking-[-1px] text-high-emphasis outline-none transition-all duration-150 placeholder:text-low-emphasis focus:ring-2 focus:ring-primary"
              />
            </Modal>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 text-[18px] font-bold tracking-[-1px] text-high-emphasis">
          Alert (Toast)
        </h2>

        <div className="space-y-6">
          {/* 아이콘 + 설명 + 링크 */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              아이콘 + 설명 + 링크
            </h3>
            <div className="max-w-md">
              <Alert
                open
                icon="🎵"
                title="새로운 플레이리스트가 추가되었습니다"
                description="오늘의 Vibe에 맞는 음악을 들어보세요."
                linkText="플레이리스트 보기"
                onLinkClick={() => alert("링크 클릭!")}
                onClose={() => alert("닫기!")}
                duration={0}
                position="top-right"
              />
            </div>
          </div>

          {/* 제목 + 설명만 */}
          <div>
            <h3 className="mb-3 text-[14px] font-bold tracking-[-1px] text-caption">
              제목 + 설명만
            </h3>
            <div className="max-w-md">
              <Alert
                open
                title="프로필이 업데이트되었습니다"
                description="변경사항이 저장되었습니다."
                onClose={() => alert("닫기!")}
                duration={0}
                position="bottom-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 테스트 영역 끝 ===== */}
    </div>
  );
}

export default ComponentTestPage;
