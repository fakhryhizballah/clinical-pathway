import ClinicalPathwayPage from '../../../components/ClinicalPathwayPage';

export default async function Page({ params }: { params: Promise<{ id: string; }> }) {
  const { id } = await params;
  console.log(id);

  return <ClinicalPathwayPage id={id} />;
}
