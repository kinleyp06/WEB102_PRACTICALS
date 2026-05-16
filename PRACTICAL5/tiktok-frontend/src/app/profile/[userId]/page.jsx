export default function ProfilePage({ params }) {
  return (
    <div>
      <h1 className="text-5xl font-bold">User Profile</h1>

      <p className="mt-4">User ID: {params.userId}</p>
    </div>
  );
}
