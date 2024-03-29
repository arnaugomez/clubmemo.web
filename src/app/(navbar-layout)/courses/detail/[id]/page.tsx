export default function CourseDetailPage({
  params: { id },
}: {
  // TODO: create reusable type for id params
  params: { id: string };
}) {
  return <>course {id}</>;
}
