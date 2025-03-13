import Chat from './components/Chat/component';

export default function Home() {
  return (
    <main>
      <Chat user='User' assistant='Assistant' maxContextTurns={undefined} />
    </main>
  );
}
