import { useNavigate, useLocation } from 'react-router-dom';
import TabToggle from '../common/TabToggle';
import ProfileDropdown from '../common/ProfileDropdown';
import { useAppMode } from '../../hooks/useAppMode';

type Tab = 'generate' | 'explore';

const HEADER_TABS: { key: Tab; label: string }[] = [
  { key: 'generate', label: 'Generate' },
  { key: 'explore', label: 'Explore' },
];

const VibelinkLogo = () => (
  <svg
    viewBox="64 37 239 36"
    className="h-7 text-brand"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M99.3541 54.6771H64C64 59.3653 65.8624 63.8616 69.1775 67.1766C72.4926 70.4917 76.9888 72.3541 81.6771 72.3541C86.3653 72.3541 90.8615 70.4917 94.1766 67.1766C97.4917 63.8616 99.3541 59.3653 99.3541 54.6771Z" fill="currentColor" />
    <path d="M81.6771 54.6771C81.6771 49.9888 79.8146 45.4926 76.4996 42.1775C73.1845 38.8624 68.6883 37 64 37L64 54.6771H81.6771Z" fill="currentColor" />
    <path d="M81.6772 54.6771C81.6772 49.9888 83.5397 45.4926 86.8548 42.1775C90.1698 38.8624 94.6661 37 99.3543 37V54.6771H81.6772Z" fill="currentColor" />
    <path d="M118.391 72.3541V54.6771H100.714L100.714 72.3541H118.391Z" fill="currentColor" />
    <path d="M118.391 54.6771V37L100.714 37L100.714 54.6771H118.391Z" fill="currentColor" />
    <path d="M137.428 54.6771V37L119.75 37L119.75 54.6771H137.428Z" fill="currentColor" />
    <path d="M137.428 72.3541V54.6771H119.75L119.75 72.3541H137.428Z" fill="currentColor" />
    <path d="M137.088 54.6771C141.969 54.6771 145.926 50.7199 145.926 45.8385C145.926 40.9572 141.969 37 137.088 37C132.206 37 128.249 40.9572 128.249 45.8385C128.249 50.7199 132.206 54.6771 137.088 54.6771Z" fill="currentColor" />
    <path d="M137.088 72.3541C141.969 72.3541 145.926 68.397 145.926 63.5156C145.926 58.6342 141.969 54.6771 137.088 54.6771C132.206 54.6771 128.249 58.6342 128.249 63.5156C128.249 68.397 132.206 72.3541 137.088 72.3541Z" fill="currentColor" />
    <path d="M173.462 54.6771V37L155.785 37V54.6771H173.462Z" fill="currentColor" />
    <path d="M173.462 72.3541V54.6771H155.785V72.3541H173.462Z" fill="currentColor" />
    <path d="M156.125 54.6771C161.006 54.6771 164.963 50.7199 164.963 45.8385C164.963 40.9572 161.006 37 156.125 37C151.243 37 147.286 40.9572 147.286 45.8385C147.286 50.7199 151.243 54.6771 156.125 54.6771Z" fill="currentColor" />
    <path d="M156.125 72.3541C161.006 72.3541 164.963 68.397 164.963 63.5156C164.963 58.6342 161.006 54.6771 156.125 54.6771C151.243 54.6771 147.286 58.6342 147.286 63.5156C147.286 68.397 151.243 72.3541 156.125 72.3541Z" fill="currentColor" />
    <path d="M192.498 72.3541V54.6771H174.821L174.821 72.3541H192.498Z" fill="currentColor" />
    <path d="M192.498 54.6771V37L174.821 37L174.821 54.6771H192.498Z" fill="currentColor" />
    <path d="M192.499 72.3541C192.499 67.6659 194.361 63.1696 197.676 59.8546C200.991 56.5395 205.487 54.6771 210.176 54.6771V72.3541H192.499Z" fill="currentColor" />
    <path d="M229.213 72.3541V54.6771H211.536L211.536 72.3541H229.213Z" fill="currentColor" />
    <path d="M229.213 54.6771V37L211.536 37L211.536 54.6771H229.213Z" fill="currentColor" />
    <path d="M248.249 54.6771H230.572L230.572 72.3541H248.249V54.6771Z" fill="currentColor" />
    <path d="M248.25 54.6771H265.927V37L248.25 37V54.6771Z" fill="currentColor" />
    <path d="M248.249 54.6771C248.249 49.9888 246.387 45.4926 243.072 42.1775C239.757 38.8624 235.261 37 230.572 37L230.572 54.6771H248.249Z" fill="currentColor" />
    <path d="M248.25 54.6771C248.25 59.3654 250.112 63.8616 253.427 67.1767C256.742 70.4918 261.238 72.3541 265.927 72.3541V54.6771H248.25Z" fill="currentColor" />
    <path d="M284.963 72.3541V54.6771H267.286L267.286 72.3541H284.963Z" fill="currentColor" />
    <path d="M284.963 54.6771V37L267.286 37L267.286 54.6771H284.963Z" fill="currentColor" />
    <path d="M302.64 72.3541C302.64 67.6659 300.778 63.1696 297.463 59.8546C294.148 56.5395 289.652 54.6771 284.963 54.6771V72.3541H302.64Z" fill="currentColor" />
    <path d="M302.64 37C302.64 41.6883 300.778 46.1845 297.463 49.4996C294.148 52.8147 289.652 54.6771 284.963 54.6771V37L302.64 37Z" fill="currentColor" />
  </svg>
);

const BellIcon = () => (
  <svg
    viewBox="1653 40 28 30"
    className="w-4.5 h-4.5 text-icon"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1658.87 48.958C1659.3 45.0679 1662.59 42.125 1666.5 42.125C1670.41 42.125 1673.7 45.0679 1674.13 48.958L1674.48 52.074C1674.56 52.7613 1674.59 53.1049 1674.66 53.4406C1674.8 54.1182 1675.02 54.7756 1675.32 55.3962C1675.47 55.7037 1675.65 56.0001 1676.01 56.5931L1677.06 58.346C1677.86 59.6889 1678.27 60.3604 1677.98 60.8677C1677.69 61.375 1676.91 61.375 1675.34 61.375H1657.66C1656.09 61.375 1655.31 61.375 1655.02 60.8677C1654.73 60.3604 1655.14 59.6889 1655.94 58.346L1656.99 56.5931C1657.35 56.0001 1657.53 55.7037 1657.68 55.3962C1657.98 54.7756 1658.2 54.1182 1658.34 53.4406C1658.41 53.1049 1658.44 52.7613 1658.52 52.074L1658.87 48.958Z"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M1661 61.375C1661 62.0973 1661.14 62.8125 1661.42 63.4798C1661.7 64.147 1662.1 64.7534 1662.61 65.2641C1663.12 65.7748 1663.73 66.1799 1664.4 66.4563C1665.06 66.7327 1665.78 66.875 1666.5 66.875C1667.22 66.875 1667.94 66.7327 1668.6 66.4563C1669.27 66.1799 1669.88 65.7748 1670.39 65.2641C1670.9 64.7534 1671.3 64.147 1671.58 63.4798C1671.86 62.8125 1672 62.0973 1672 61.375"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Header = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const { sidebarMode, profilePage, switchToExplore } = useAppMode();

  /** 프로필 페이지 라벨 매핑 */
  const profilePageLabel = profilePage === 'my-info' ? '내 정보' : '설정';

  return (
    <header className="w-full bg-white">
      <div className="flex items-center px-page-x h-header">
        {/* Logo — 클릭 시 Explore 모드로 복귀 */}
        <div className="flex-1">
          <a
            href="/"
            className="shrink-0 inline-block"
            onClick={(e) => {
              e.preventDefault();
              switchToExplore();
            }}
          >
            <VibelinkLogo />
          </a>
        </div>

        {/* 중앙: Explore 모드 → TabToggle / Profile 모드 → 페이지명 */}
        {sidebarMode === 'explore' ? (
          <TabToggle tabs={HEADER_TABS} activeTab={activeTab} onChange={setActiveTab} />
        ) : (
          <span className="text-brand text-sm font-medium">{profilePageLabel}</span>
        )}

        {/* Right Section — ProfileDropdown으로 교체 */}
        <div className="flex-1 flex items-center justify-end gap-5">
          <button className="cursor-pointer">
            <BellIcon />
          </button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
