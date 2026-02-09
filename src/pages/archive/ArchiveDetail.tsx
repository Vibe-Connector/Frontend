import { useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import ExploreMasonryGrid from '@/components/common/ExploreMasonryGrid';

export default function ArchiveDetail() {
  const { folderId } = useParams<{ folderId: string }>();

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold tracking-[-1px] text-high-emphasis">
        Archive — {folderId}
      </h1>
      <ExploreMasonryGrid seedOffset={Number(folderId) * 100 || 1} />
    </PageContainer>
  );
}
