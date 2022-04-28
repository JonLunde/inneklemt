import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const { data, error, isLoading } = trpc.useQuery([
    'hello',
    { text: 'client' },
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{data?.greeting}</p>
    </div>
  );
}
